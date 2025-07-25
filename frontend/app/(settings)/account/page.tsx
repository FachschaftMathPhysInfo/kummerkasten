"use client";

import {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {ManagementPageHeader} from "@/components/management-page-header";
import {LockKeyhole, SettingsIcon, User} from "lucide-react";
import {SettingsField} from "@/components/settings-field";
import {SettingsBlock} from "@/components/settings-block";
import {
    CheckForMailDocument,
    LoginDocument,
    UpdateUserDocument,
    UpdateUserSettingsDocument,
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables,
    UserSettingsDocument,
    UserSettingsQuery
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {useUser} from "@/components/providers/user-provider";
import {Form, FormField} from "@/components/ui/form";

const profileSettingsSchema = z.object({
    firstname: z.string().min(1, "Vorname ist erforderlich"),
    lastname: z.string().min(1, "Nachname ist erforderlich"),
    mail: z.string().email("Ungültige E-Mail-Adresse"),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
});

type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

const passwordFormSchema = z
    .object({
        oldPassword: z.string().nonempty("Bitte gib dein aktuelles Passwort ein."),
        newPassword: z
            .string()
            .min(8, {message: "Mindestens 8 Zeichen."})
            .regex(/[A-Z]/, {message: "Mindestens ein Großbuchstabe."})
            .regex(/\d/, {message: "Mindestens eine Zahl."})
            .regex(/[!@#$%^&*(),.?":{}|<>]/, {
                message: "Mindestens ein Sonderzeichen.",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwörter stimmen nicht überein.",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordFormSchema>;


export default function Page() {
    const {user} = useUser();


    const form = useForm<ProfileSettingsFormData>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            mail: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
    const fetchProfileData = useCallback(async () => {
        if (!user?.id) return;
        const client = getClient();


        try {
            const data = await client.request<UserSettingsQuery>(UserSettingsDocument, {id: user.id});
            const userData = data?.users?.[0];
            if (!userData) {
                toast.error("Keine Benutzerdaten gefunden");
                return;
            }

            form.reset({
                firstname: userData.firstname,
                lastname: userData.lastname,
                mail: userData.mail,
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error("Fehler beim Laden der User Daten");
            console.error(error);
        }
    }, [user, form]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    useEffect(() => {
        const subscription = form.watch((value, {type}) => {
            if (hasTriedToSubmit && type === "change") {
                setHasTriedToSubmit(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, hasTriedToSubmit]);


    async function onValidSubmit(userData: ProfileSettingsFormData) {
        const client = getClient();


        if (!user?.id) {
            toast.error("Ein Fehler ist aufgetreten, melde dich erneut an");
            return;
        }

        if (userData.mail !== user.mail) {
            try {
                const existing = await client.request(CheckForMailDocument, {mail: userData.mail});
                const emailUsedByOtherUser = existing.users?.some((u) => u?.id !== user.id);

                if (emailUsedByOtherUser) {
                    form.setError("mail", {
                        message: "Diese E-Mail-Adresse wird bereits verwendet.",
                    });
                    toast.error("Diese E-Mail-Adresse wird bereits verwendet.");
                    return;
                }
            } catch (error) {
                toast.error("Fehler beim Überprüfen der E-Mail-Adresse.");
                console.error(error);
                return;
            }
        }

        const updateData: UpdateUserSettingsMutationVariables = {
            id: user.id,
            user: {
                mail: userData.mail,
                firstname: userData.firstname,
                lastname: userData.lastname,
            },
        };

        try {
            await client.request<UpdateUserSettingsMutation>(UpdateUserSettingsDocument, updateData);
            toast.success("Dein Account wurde erfolgreich aktualisiert");
        } catch (error) {

            toast.error("Ein Fehler ist aufgetreten");
            console.error(error);
        }
    }

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [hasTriedPasswordSubmit, setHasTriedPasswordSubmit] = useState(false);

    async function onPasswordSubmit(data: PasswordFormData) {
        if (!user) {
            toast.error("Fehler beim Laden des Benutzers.");
            return;
        }

        const client = getClient();

        let loginResponse;
        try {
            loginResponse = await client.request(LoginDocument, {
                mail: user.mail,
                password: data.oldPassword,
            });
        } catch {
            toast.error("Fehler beim Überprüfen des Passworts.");
            return;
        }

        if (!loginResponse.login) {
            passwordForm.setError("oldPassword", {
                message: "Falsches aktuelles Passwort.",
            });
            toast.error("Falsches aktuelles Passwort.");
            return;
        }

        try {
            await client.request(UpdateUserDocument, {
                id: user.id,
                user: {
                    mail: user.mail,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    password: data.newPassword,
                },
            });
            toast.success("Passwort aktualisiert.");
            passwordForm.reset();
            setHasTriedPasswordSubmit(false);
        } catch {
            toast.error("Fehler beim Speichern.");
        }
    }


    return (
        <div className="space-y-6 grow">
            <ManagementPageHeader
                icon={<SettingsIcon/>}
                title="Mein Account"
                description="Bearbeite deine persönlichen Einstellungen"
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
                      className="space-y-6">
                    <SettingsBlock icon={<User/>} title="Account" hasTriedToSubmit={hasTriedToSubmit} dataCy="input-profile-save" >
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    title="Vorname"
                                    placeholder="Vorname"
                                    visibilityToggle={false}
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-firstname-input"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    title="Nachname"
                                    placeholder="Nachname"
                                    visibilityToggle={false}
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-lastname-input"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mail"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    title="E-Mail"
                                    placeholder="E-Mail"
                                    visibilityToggle={false}
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-mail-input"
                                />
                            )}
                        />
                    </SettingsBlock>
                </form>
            </Form>
            <Form {...passwordForm}>
                <form
                    onSubmit={passwordForm.handleSubmit(
                        onPasswordSubmit,
                        () => setHasTriedPasswordSubmit(true)
                    )}
                >
                    <SettingsBlock icon={<LockKeyhole/>} title="Passwort" hasTriedToSubmit={hasTriedPasswordSubmit} dataCy="input-settings-save">
                        <FormField
                            control={passwordForm.control}
                            name="oldPassword"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    title="Aktuelles Passwort"
                                    placeholder="Aktuelles Passwort"
                                    visibilityToggle
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-current-password-input"
                                />
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    title="Neues Passwort"
                                    placeholder="Neues Passwort"
                                    visibilityToggle
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-new-password-input"
                                />
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({field, fieldState}) => (
                                <SettingsField
                                    placeholder="Passwort bestätigen"
                                    visibilityToggle
                                    field={field}
                                    error={fieldState.error?.message}
                                    dataCy="account-repeated-password-input"
                                />
                            )}
                        />
                    </SettingsBlock>
                </form>
            </Form>
        </div>
    );
}
