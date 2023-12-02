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

	const totalSessions = data.sessions.length;
	const finishedSessions = data.sessions.filter((session) => session.finished).length;
</script>

<div class="flex h-screen w-full flex-col p-4">
	<header class="flex w-full items-center justify-between">
		<a href="/" class="text-lg underline">Back</a>
		<span class="text-lg">{finishedSessions}/{totalSessions}</span>
		<button class="flex rounded-full p-2 text-2xl" on:click={share}><Share /></button>
	</header>
	<main>
		<h1 class="sr-only">Matcher</h1>
		<pre class="overflow-scroll">{JSON.stringify(data, null, 2)}</pre>
	</main>
</div>
