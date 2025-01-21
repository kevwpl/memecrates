<script lang="ts">
    import { t, locale } from "$lib/i18n.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import CompanySelection from "$lib/components/ui/CompanySelection.svelte";

    import {Clock3, FilePlus, Handshake, LayoutDashboard, Package, ReceiptEuroIcon, Shell, Users} from "lucide-svelte";
    import type {Company, User} from "$lib/types";
    import GalleryVerticalEnd from "lucide-svelte/icons/gallery-vertical-end";
    import NavUser from "$lib/components/ui/NavUser.svelte";

    let companies : Company[] = $state([
        {
            name: "Laden",
            street: "Kinostraße 14/2",
            zip: 3680,
            town: "Persenbeug",
            uuid: "ATU12345678",
            icon: GalleryVerticalEnd,
        }
    ]);
    let user: User = $state({});

    const navMain = [
        {
            title: t("nav.general"),
            url: "#",
            items: [
                {
                    title: t("nav.dashboard"),
                    url: "/" + locale.lang + "/app/dashboard",
                    icon: LayoutDashboard
                }
            ],
        },
        {
            title: t("nav.management"),
            url: "#",
            items: [
                {
                    title: t("nav.receipts"),
                    url: "/" + locale.lang + "/app/invoices",
                    icon: ReceiptEuroIcon
                },
                {
                    title: t("nav.customers"),
                    url: "/" + locale.lang + "/app/customers",
                    icon: Users
                },
                {
                    title: t("nav.services"),
                    url: "/" + locale.lang + "/app/services",
                    icon: Handshake
                },
                {
                    title: t("nav.products"),
                    url: "/" + locale.lang + "/app/products",
                    icon: Package
                },
            ],
        }
    ];

    async function fetchCompanies(
        endpoint: string,
        sessionToken: string
    ){
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
                return { error: errorResponse.error || "An unknown error occurred" };
            }

            const data = await response.json();
            companies = data;
        } catch (error) {
            console.error("Error in getCompanies:", error);
            return { error: "Failed to fetch companies" };
        }
    }

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
                return { error: errorResponse.error || "An unknown error occurred" };
            }

            const userResponse: User = await response.json();
            user = userResponse;
        } catch (error) {
            console.error("Error in fetchUser:", error);
            return { error: "Failed to fetch user" };
        }
    }

    $effect.pre(() => {
        fetchCompanies("/api/get/company", sessionStorage.getItem("token") || "");
        fetchUser("/api/get/user/token", sessionStorage.getItem("token") || "");
    })
</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Header>
        {#if companies[0].name !== "Laden"}
            <CompanySelection companies={companies} defaultCompany={companies[0]}/>
        {/if}
    </Sidebar.Header>
    <Sidebar.Content>
        <!-- We create a Sidebar.Group for each parent. -->
        {#each navMain as group (group.title)}
            <Sidebar.Group>
                <Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each group.items as item (item.title)}
                            <Sidebar.MenuItem>
                                {@const Icon = item.icon}
                                <Sidebar.MenuButton>
                                    {#snippet child({ props })}
                                        <a href={item.url} {...props}>
                                            <Icon />
                                            {item.title}
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        {/each}
    </Sidebar.Content>
    <Sidebar.Footer>
        <NavUser {user}/>
    </Sidebar.Footer>
    <Sidebar.Rail />
</Sidebar.Root>

