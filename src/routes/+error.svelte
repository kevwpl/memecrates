<script lang="ts">
    import {goto} from "$app/navigation";

    let { children } = $props();
    async function fetchUser(
        endpoint: string,
        sessionToken: string
    ) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionToken }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                goto("/en/login");
            }else{
                goto("/en/app/dashboard");
            }
        } catch (error) {
            goto("/en/login");
        }
    }

    $effect.pre(() => {
        fetchUser("/api/get/user/token", sessionStorage.getItem("token") || "");
    })
</script>