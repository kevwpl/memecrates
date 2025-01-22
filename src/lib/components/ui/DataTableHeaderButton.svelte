<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { Button } from "$lib/components/ui/button";
    import {ChevronDown, ChevronsUpDown, ChevronUp} from "lucide-svelte";

    let {  name, sort, ...restProps }: ComponentProps<typeof Button> =
        $props();
</script>

<Button variant={(sort === "asc" || sort === "desc") ? "secondary" : "ghost" } {...restProps}>
    {name}
    {#if sort === "asc"}
        <ChevronUp class="ml-2 size-4" />
    {:else if sort === "desc"}
        <ChevronDown class="ml-2 size-4" />
    {:else}
        <ChevronsUpDown class="ml-2 size-4" />
    {/if}
</Button>