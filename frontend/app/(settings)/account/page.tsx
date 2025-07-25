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
        const subscription = form.watch((value, { type }) => {
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
                    <SettingsBlock icon={<User/>} title="Account" hasTriedToSubmit={hasTriedToSubmit}>
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({field}) => (
                                <SettingsField
                                    title="Vorname"
                                    placeholder="Vorname"
                                    visibilityToggle={false}
                                    field={field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({field}) => (
                                <SettingsField
                                    title="Nachname"
                                    placeholder="Nachname"
                                    visibilityToggle={false}
                                    field={field}
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
                                />
                            )}
                        />
                    </SettingsBlock>

                    <SettingsBlock icon={<LockKeyhole/>} title="Passwort">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({field}) => (
                                <SettingsField
                                    title="Altes Passwort"
                                    placeholder="Altes Passwort"
                                    visibilityToggle={true}
                                    field={field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <SettingsField
                                    title="Neues Passwort"
                                    placeholder="Neues Passwort"
                                    visibilityToggle={true}
                                    field={field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <SettingsField
                                    title="Neues Passwort bestätigen"
                                    placeholder="Neues Passwort bestätigen"
                                    visibilityToggle={true}
                                    field={field}
                                />
                            )}
                        />
                    </SettingsBlock>
                </form>
            </Form>
        </div>
    );
}
