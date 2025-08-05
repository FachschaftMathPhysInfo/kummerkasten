"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {LoginDocument, UpdateUserDocument} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useUser} from "@/components/providers/user-provider";
import {SettingsBlock} from "@/components/settings-block";
import {User} from "lucide-react";
import {Input} from "@/components/ui/input";

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
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
        message: "Neues Passwort darf nicht dem alten entsprechen.",
        path: ["newPassword"],
    });

type PasswordFormData = z.infer<typeof passwordFormSchema>;


export default function PasswordDataForm() {
    const {user, logout} = useUser();
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const isItLoading = false;
    const [hasTriedPasswordSubmit, setHasTriedPasswordSubmit] = useState(false);

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    async function onPasswordSubmit(data: PasswordFormData) {
        setIsSavingPassword(true);
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
            if (!loginResponse.login) {
                passwordForm.reset({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                passwordForm.setError("oldPassword", {
                    message: "Falsches aktuelles Passwort.",
                });
                toast.error("Falsches aktuelles Passwort.");
                return;
            }

            await client.request(UpdateUserDocument, {
                id: user.id,
                user: {
                    password: data.newPassword,
                },
            });
            toast.success("Passwort aktualisiert. Du wirst jetzt ausgeloggt.");
            passwordForm.reset();
            setHasTriedPasswordSubmit(false);
            await logout();

        } catch (err) {
            console.error(err);
            toast.error("Fehler beim Speichern.");
            return;
        } finally {
            setIsSavingPassword(false);
        }
    }


    useEffect(() => {
        const subscription = passwordForm.watch((_, {type}) => {
            if (hasTriedPasswordSubmit && type === "change") {
                setHasTriedPasswordSubmit(false);
                passwordForm.clearErrors();
            }
        });
        return () => subscription.unsubscribe();
    }, [passwordForm, hasTriedPasswordSubmit]);


    return (

        <FormProvider {...passwordForm}>
            <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit, () =>
                    setHasTriedPasswordSubmit(true)
                )}
                className="space-y-4 w-full"
            >

                <SettingsBlock icon={<User/>} title={"Account"} hasTriedToSubmit={hasTriedPasswordSubmit}
                               isDirty={passwordForm.formState.isDirty}
                               isLoading={isItLoading}
                               isSaving={isSavingPassword}
                               dataCy="input-settings-save">
                    <FormField
                        control={passwordForm.control}
                        name="oldPassword"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>Aktuelles Passwort</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Aktuelles Passwort"} {...field} type={"password"}
                                           data-cy={'account-current-password-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-current-password-input-message'}/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>Neues Passwort</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Neues Passwort"} {...field} type={"password"}
                                           data-cy={'account-new-password-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-new-password-input-message'}/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormControl>
                                    <Input placeholder={"Wiederhole dein neues Passwort"} {...field} type={"password"}
                                           data-cy={'account-confirm-password-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-confirm-password-input-message'}/>
                            </FormItem>
                        )}
                    />
                </SettingsBlock>
            </form>
        </FormProvider>
    )
}