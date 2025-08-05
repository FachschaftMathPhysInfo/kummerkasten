"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
    CheckIfMailExistsDocument,
    UpdateUserSettingsDocument,
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables,
    UserAccountDataDocument,
    UserAccountDataQuery
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useUser} from "@/components/providers/user-provider";
import {SettingsBlock} from "@/components/settings-block";
import {User} from "lucide-react";

const accountDataSchema = z.object({
    firstname: z.string().min(1, "Vorname ist erforderlich").max(50, "Maximale Länge beträgt 50 Charaktere"),
    lastname: z.string().min(1, "Nachname ist erforderlich").max(50, "Maximale Länge beträgt 50 Charaktere"),
    mail: z.email("Ungültige E-Mail-Adresse"),
});

type AccountDataFormData = z.infer<typeof accountDataSchema>;

export default function AccountDataForm() {
    const {user, logout} = useUser();
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

    const form = useForm<z.infer<typeof accountDataSchema>>({
        resolver: zodResolver(accountDataSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            mail: "",
        }
    })

    const fetchProfileData = useCallback(async () => {
        if (!user?.id) return;
        const client = getClient();

        try {
            const data = await client.request<UserAccountDataQuery>(UserAccountDataDocument, {id: user.id});
            const userData = data?.users?.[0];
            if (!userData) {
                toast.error("Keine Benutzerdaten gefunden");
                return;
            }

            form.reset({
                firstname: userData.firstname,
                lastname: userData.lastname,
                mail: userData.mail,
            });
            setIsLoading(false);
        } catch (error) {
            toast.error("Fehler beim Laden der User Daten");
            console.error(error);
        }
    }, [user?.id, form]);

    useEffect(() => {
        void fetchProfileData();
    }, [fetchProfileData]);

    useEffect(() => {
        const subscription = form.watch((_value, {type}) => {
            if (hasTriedToSubmit && type === "change") {
                setHasTriedToSubmit(false);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, hasTriedToSubmit]);

    async function onValidSubmit(userData: AccountDataFormData) {
        setIsSavingAccount(true);
        const client = getClient();

        if (!user?.id) {
            toast.error("Ein Fehler ist aufgetreten, melde dich erneut an");
            return;
        }

        if (userData.mail !== user.mail) {
            try {
                const existing = await client.request(CheckIfMailExistsDocument, {mail: userData.mail});
                const emailUsedByOtherUser = existing.users?.some((u) => u?.id !== user.id);

                if (emailUsedByOtherUser) {
                    form.setError("mail", {
                        message: "Diese E-Mail-Adresse wird bereits verwendet.",
                    });
                    toast.error("Diese E-Mail-Adresse wird bereits verwendet.");
                    setIsSavingAccount(false);
                    return;
                }
            } catch (error) {
                toast.error("Fehler beim Überprüfen der E-Mail-Adresse.");
                console.error(error);
                setIsSavingAccount(false);
                return;
            }
        }

        const updateData: UpdateUserSettingsMutationVariables = {
            id: user.id,
            user: {
                mail: userData.mail.trimStart().trimEnd(),
                firstname: userData.firstname.trimStart().trimEnd(),
                lastname: userData.lastname.trimStart().trimEnd(),
            },
        };

        try {
            await client.request<UpdateUserSettingsMutation>(UpdateUserSettingsDocument, updateData);
            form.reset({
                firstname: userData.firstname,
                lastname: userData.lastname,
                mail: userData.mail,
            });
            toast.success("Dein Account wurde erfolgreich aktualisiert. Du wirst jetzt ausgeloggt.");
            if (userData.mail !== user.mail) {
                await logout();
                return;
            }
        } catch (error) {
            toast.error("Ein Fehler ist aufgetreten");
            console.error(error);
        } finally {
            setIsSavingAccount(false);
        }
    }


    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onValidSubmit, () =>
                    setHasTriedToSubmit(true)
                )}
                className="space-y-4 w-full"
            >

                <SettingsBlock icon={<User/>} title={"Account"} hasTriedToSubmit={hasTriedToSubmit}
                               isDirty={form.formState.isDirty}
                               isSaving={isSavingAccount}
                               isLoading={isLoading}
                               dataCy="input-profile-save">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>Vorname</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Vorname"} {...field} data-cy={'account-firstname-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-firstname-input-message'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>Nachname</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Nachname"} {...field} data-cy={'account-lastname-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-lastname-input-message'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mail"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>E-Mail</FormLabel>
                                <FormControl>
                                    <Input placeholder={"vor.nachname@kummerkasten.de"} {...field}
                                           data-cy={'account-mail-input'}/>
                                </FormControl>
                                <FormMessage data-cy={'account-mail-input-message'}/>
                            </FormItem>
                        )}
                    />
                </SettingsBlock>
            </form>
        </FormProvider>
    )
}