<script lang="ts">
    import { locale } from '$lib/i18n.svelte'

    let { children } = $props();

    import { page } from '$app/stores';
    page.subscribe((value) => {
        locale.lang = value.params.lang;
    });
</script>

{@render children?.()}