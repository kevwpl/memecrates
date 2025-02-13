<script>
    import { onMount } from 'svelte';
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.ts";
    import { Package } from "lucide-svelte";

    // Crate definitions
    let items = {
        common: {
            skin: "Common",
            img: "https://static.wikia.nocookie.net/mining-simulator/images/0/0d/Common_hat_crate.png"
        },
        uncommon: {
            skin: "Uncommon",
            img: "https://static.wikia.nocookie.net/mining-simulator/images/2/28/Unique_hat_crate.png"
        },
        rare: {
            skin: "Rare",
            img: "https://static.wikia.nocookie.net/mining-simulator/images/e/e1/Epic_hat_crate.png"
        },
        epic: {
            skin: "Epic",
            img: "https://static.wikia.nocookie.net/mining-simulator/images/6/64/Mythical_hat_crate.png"
        },
        legendary: {
            skin: "Legendary",
            img: "https://static.wikia.nocookie.net/mining-simulator/images/1/18/Omega_hat_crate.png"
        }
    };

    // Constants for the lootbox
    const lootboxWidth = 900;
    const itemWidth = 85;
    // Variable to track the last tick index
    let lastTickIndex = -1;

    // Create a variable for the audio element; it will be initialized on the client.
    let tickSound;

    // Use onMount to ensure browser-only code runs after the component mounts
    onMount(() => {
        tickSound = new Audio('/tick.wav');
        tickSound.volume = 0.2; // Adjust volume as needed
    });

    // Crate functions and variables
    function getRandomItem() {
        let roll = Math.random() * 1000;
        if (roll <= 20) return items.legendary;
        if (roll <= 100) return items.epic;
        if (roll <= 300) return items.rare;
        if (roll <= 600) return items.uncommon;
        return items.common;
    }

    function resetItems() {
        itemList = Array.from({ length: 101 }, () => getRandomItem());
        translateX = 0;
        popupCrate = null;
        showVideo = false;
        videoUrl = null;
        lastTickIndex = -1; // Reset tick tracking when starting a new spin
    }

    let itemList = Array.from({ length: 101 }, () => getRandomItem());
    let rolling = false;
    let translateX = 0;
    let speed = 100;
    let interval;

    // Inventory for won crates
    let inventory = [];

    // Popup state for crate modal
    let popupCrate = null;
    let showVideo = false;
    let videoUrl = null;

    // Popup state for submitting a meme
    let showSubmitPopup = false;
    let memeVideoLink = "";
    let memeRarity = "Common";

    async function openCase() {
        if (rolling) return;
        rolling = true;
        resetItems();
        speed = 100; // Reset speed for a new spin

        interval = setInterval(() => {
            translateX -= speed;
            if (speed > 0.1) speed *= 0.980 + Math.random() * 0.01;

            // Calculate the index when the crate's left edge reaches the center
            const currentTickIndex = Math.floor((Math.abs(translateX) + lootboxWidth / 2) / itemWidth);
            if (currentTickIndex !== lastTickIndex) {
                lastTickIndex = currentTickIndex;
                // Play tick sound only if tickSound has been initialized (i.e., on the client)
                if (tickSound) {
                    tickSound.currentTime = 0;
                    tickSound.play();
                }
            }

            if (speed <= 0.1) {
                clearInterval(interval);
                rolling = false;
                selectFinalItem();
            }
        }, 16);
    }

    function selectFinalItem() {
        const offsetFinal = lootboxWidth / 2 - itemWidth / 2; // Center offset
        let selectedIndex =
            Math.round((Math.abs(translateX) + offsetFinal) / itemWidth) % itemList.length;
        let selectedItem = itemList[selectedIndex];
        console.log("Selected Item Index:", selectedIndex, "Selected Item:", selectedItem);
        // Add the selected crate to the inventory and show it in the popup
        inventory = [...inventory, selectedItem];
        popupCrate = selectedItem;
    }

    // Fetch a random YouTube video based on rarity from the backend
    async function getYTVideo(rarity) {
        try {
            const res = await fetch('/api/getMeme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rarity })
            });
            if (!res.ok) {
                console.error("Failed to fetch video", await res.text());
                return null;
            }
            const data = await res.json();
            // Construct a YouTube embed URL using the fetched videoid
            return `https://www.youtube.com/embed/${data.videoid}`;
        } catch (error) {
            console.error("Error fetching video:", error);
            return null;
        }
    }

    function removeCrateFromInventory(crate) {
        const index = inventory.findIndex((c) => c === crate);
        if (index !== -1) {
            inventory.splice(index, 1);
            inventory = [...inventory];
        }
    }

    async function openNow() {
        removeCrateFromInventory(popupCrate);
        videoUrl = await getYTVideo(popupCrate.skin);
        showVideo = true;
    }

    function closePopup() {
        popupCrate = null;
        showVideo = false;
        videoUrl = null;
    }

    async function submitMeme() {
        try {
            // Extract video id from the link if necessary
            let videoId = memeVideoLink;
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
            const match = memeVideoLink.match(youtubeRegex);
            if (match && match[1]) {
                videoId = match[1];
            }

            const res = await fetch('/api/submitMeme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoLink: videoId, rarity: memeRarity })
            });
            if (!res.ok) {
                console.error("Failed to submit meme", await res.text());
                return;
            }
            // Optionally clear the form and close the popup
            memeVideoLink = "";
            memeRarity = "Common";
            showSubmitPopup = false;
            alert("Meme submitted successfully!");
        } catch (error) {
            console.error("Error submitting meme:", error);
        }
    }

    function closeSubmitPopup() {
        showSubmitPopup = false;
    }
</script>

<div class="min-h-screen flex flex-col items-center justify-center space-y-10 p-4">
    <!-- Buttons Row -->
    <div class="flex space-x-4">
        <!-- Open Crate Button -->
        <Button
                onclick={openCase}
                disabled={rolling}
                class="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Package class="mr-2" />
            Open Memecrate
        </Button>
        <!-- Submit Meme Button -->
        <Button
                onclick={() => (showSubmitPopup = true)}
                class="px-6 py-3 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
        >
            Submit Meme
        </Button>
    </div>

    <!-- Lootbox Spinner -->
    <div class="w-[900px] h-[100px] overflow-hidden relative mt-4">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-red-500 z-10"></div>
        <div
                class="flex transition-none will-change-[transform]"
                style="transform: translateX({translateX}px)"
        >
            {#each itemList as item}
                <Card.Root
                        class="w-[85px] h-[88px] flex-shrink-0 bg-cover bg-center bg-origin-content p-2 bg-no-repeat"
                        style="background-image: url({item.img});"
                ></Card.Root>
            {/each}
        </div>
    </div>

    <!-- Inventory Display -->
    {#if inventory.length > 0}
        <div class="mt-10 w-full max-w-3xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Inventory</h2>
            <div class="grid grid-cols-4 gap-4">
                {#each inventory as crate}
                    <div on:click={() => (popupCrate = crate)} class="cursor-pointer">
                        <Card.Root
                                class="w-[85px] h-[88px] flex-shrink-0 bg-cover bg-center bg-origin-content p-2 bg-no-repeat"
                                style="background-image: url({crate.img});"
                        ></Card.Root>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<!-- Popup Modal for Crate -->
{#if popupCrate}
    <div
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            on:click={closePopup}
    >
        <div
                class="{showVideo ? 'w-[90vw] h-[80vh]' : 'w-96'} bg-slate-900 p-6 rounded shadow-lg"
                on:click|stopPropagation
        >
            {#if !showVideo}
                <h2 class="text-2xl font-bold mb-4">You got a {popupCrate.skin}!</h2>
                <img
                        class="mx-auto"
                        src={popupCrate.img}
                        alt={popupCrate.skin}
                        style="width: 100px; height: auto;"
                >
                <div class="mt-4 flex justify-between">
                    <Button
                            onclick={openNow}
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Open Now
                    </Button>
                    <Button
                            onclick={closePopup}
                            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </Button>
                </div>
            {:else}
                {#if videoUrl}
                    <iframe
                            class="w-full h-full"
                            src={videoUrl}
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                    ></iframe>
                {:else}
                    <p class="text-center text-white">Failed to load video</p>
                {/if}
                <div class="mt-4 flex justify-end">
                    <Button
                            onclick={closePopup}
                            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </Button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<!-- Popup Modal for Submit Meme -->
{#if showSubmitPopup}
    <div
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            on:click={closeSubmitPopup}
    >
        <div class="w-96 bg-slate-900 p-6 rounded shadow-lg" on:click|stopPropagation>
            <h2 class="text-2xl font-bold mb-4">Submit Meme</h2>
            <div class="mb-4">
                <label class="block text-white mb-2">Video Link</label>
                <input
                        type="text"
                        bind:value={memeVideoLink}
                        class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                        placeholder="Enter YouTube video link or ID"
                />
            </div>
            <div class="mb-4">
                <label class="block text-white mb-2">Rarity</label>
                <select
                        bind:value={memeRarity}
                        class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                </select>
            </div>
            <div class="flex justify-end space-x-4">
                <Button
                        onclick={submitMeme}
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Submit
                </Button>
                <Button
                        onclick={closeSubmitPopup}
                        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </Button>
            </div>
        </div>
    </div>
{/if}
