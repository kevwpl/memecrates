<script lang="ts">
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {Button} from "$lib/components/ui/button";
    import {LoaderIcon} from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import {t} from "$lib/i18n.svelte";

    // Login-Daten
    let email: string = $state("");
    let password: string = $state("");
    let errorMessage: string = $state("");
    let isLoading: boolean = $state(false);

    // API-Aufruf
    const handleSubmit = async () => {
        errorMessage = ""; // Zurücksetzen von Fehlern

        if (!email || !password) {
            toast.error("Bitte geben Sie eine gültige E-Mail und ein Passwort ein.");
            return;
        }
        isLoading = true;

        try {
            const response = await fetch('/api/get/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(t(error.error) || "Unbekannter Fehler.");
                console.error("Fehler:", errorMessage);
                isLoading = false;
                return;
            }

            const data = await response.json();
            const user = data.user;
            toast.success(`Willkommen, ${user.firstname}!`);
        } catch (err) {
            console.error("Ein Fehler ist aufgetreten:", err);
            errorMessage = "Ein Verbindungsfehler ist aufgetreten.";
        }

        isLoading = false;
    };
</script>

<div class="grid gap-2">
    <div class="grid gap-1">
        <Label class="sr-only" for="email">Email</Label>
        <Input
                bind:value={email}
                id="email"
                placeholder={t("login.examplemail")}
                type="email"
                autocapitalize="none"
                autocomplete="email"
                autocorrect="off"
                disabled={isLoading}
        />
    </div>
    <div class="grid gap-1">
        <Label class="sr-only" for="email">Password</Label>
        <Input
                bind:value={password}
                id="password"
                placeholder="••••••••"
                type="password"
                autocapitalize="none"
                autocomplete="email"
                autocorrect="off"
                disabled={isLoading}
        />
    </div>
    <Button type="submit" disabled={isLoading} onclick={handleSubmit}>
        {#if isLoading}
            <LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        {t("login.login")}
    </Button>
    {errorMessage}
</div>