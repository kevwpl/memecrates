<script lang="ts">
    import {LayoutDashboard, ReceiptEuro} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";

</script>

<div>
    <h1 class="font-bold text-2xl flex items-center gap-2"><ReceiptEuro />{t("invoices.invoices")}</h1>
    <h4 class="text-muted-foreground">{t("invoices.desc")}</h4>
</div>

<main>

</main>

<svelte:head>
    <title>{t("invoices.title")}</title>
</svelte:head>