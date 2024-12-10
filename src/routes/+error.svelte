<script lang="ts">
    import { page as auth } from "$app/stores"
    import {goto} from "$app/navigation";

    $effect.pre(() => {
        goto('/en/login');
    });
</script>