<script lang="ts">
    import {Handshake, LayoutDashboard, ReceiptEuro} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";

</script>

<div>
    <h1 class="font-bold text-2xl flex items-center gap-2"><Handshake />{t("services.services")}</h1>
    <h4 class="text-muted-foreground">{t("services.desc")}</h4>
</div>

<main>

</main>

<svelte:head>
    <title>{t("services.title")}</title>
</svelte:head>