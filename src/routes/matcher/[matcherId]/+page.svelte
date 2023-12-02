<script lang="ts">
	import { page } from "$app/stores";
	import Share from "$lib/icons/share.svelte";

	export let data;

	const share = async () => {
		const shareData = {
			text: "Match food with your friends!",
			url: $page.url.href,
		};

		try {
			await navigator.share(shareData);
			console.log("Shared successfully");
		} catch (err) {
			console.log(err);
		}
	};
</script>

<div class="flex h-screen w-full flex-col p-4">
	<button class="flex self-end rounded-full p-2 text-2xl" on:click={share}><Share /></button>
	<main>
		<h1>Matcher</h1>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</main>
</div>
