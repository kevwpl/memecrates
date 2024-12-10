<script lang="ts">
import {LayoutDashboard} from "lucide-svelte";
import { t } from "$lib/i18n.svelte.ts";

let { lang } = $props()

</script>

<h1 class="font-bold text-2xl flex items-center gap-2"><LayoutDashboard />{t("dashboard.dashboard")}</h1>
<div>
    <p>Guten Tag!</p>
</div>

<svelte:head>
    <title>{t("dashboard.title")}</title>
</svelte:head>