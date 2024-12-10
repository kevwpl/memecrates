<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import UserAuthForm from "$lib/components/UserAuthForm.svelte";
    import {t} from "$lib/i18n.svelte";
</script>

<div
        class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
    <div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div
                class="absolute inset-0 bg-cover"
                style="
				background-image:
					url('https://images.unsplash.com/photo-1730909352965-85fd88a01d80?q=802&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');"
        />
        <div class="relative z-20 flex items-center text-lg font-medium">
            Azami
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &ldquo;The most simple but effective tool for invoice generation and management!&rdquo;
                </p>
                <footer class="text-sm">Kevin Wippel</footer>
            </blockquote>
        </div>
    </div>
    <div class="lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">{t("login.login")}</h1>
                <p class="text-muted-foreground text-sm">
                    {t("login.desc")}
                </p>
            </div>
            <UserAuthForm />
            <p class="text-muted-foreground px-8 text-center text-sm">
                {t("login.tos")}
                <a href="/terms" class="hover:text-primary underline underline-offset-4">
                    Terms of Service
                </a>
                {t("login.tos2")}
                <a href="/privacy" class="hover:text-primary underline underline-offset-4">
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    </div>
</div>