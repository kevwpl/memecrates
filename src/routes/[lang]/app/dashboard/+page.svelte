<script lang="ts">
import {LayoutDashboard} from "lucide-svelte";
import { t } from "$lib/i18n.svelte.ts";
import {currentCompany} from "$lib/stores/stores";

let { lang } = $props()

let company = $state({});
const unsubscribe = currentCompany.subscribe((value) => company = value || {name: ""});

</script>

<h1 class="font-bold text-2xl flex items-center gap-2"><LayoutDashboard />{t("dashboard.dashboard")}</h1>
<div>
    <p>Guten Tag! {company.name}</p>
</div>

<svelte:head>
    <title>{t("dashboard.title")}</title>
</svelte:head>