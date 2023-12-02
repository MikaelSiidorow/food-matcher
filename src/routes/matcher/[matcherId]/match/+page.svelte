<script lang="ts">
	import { page } from "$app/stores";
	import Share from "$lib/icons/share.svelte";
	import { superForm } from "sveltekit-superforms/client";

	export let data;

	const { enhance } = superForm(data.form);

	const share = async () => {
		const shareData = {
			text: "Match food with your friends!",
			url: $page.url.href.replace("/match", ""),
		};

		try {
			await navigator.share(shareData);
			console.log("Shared successfully");
		} catch (err) {
			console.log(err);
		}
	};
</script>

<div class="relative flex h-screen w-full flex-col">
	<header class="fixed left-0 top-0 flex w-full items-center justify-between p-2">
		<a
			href="/"
			class="rounded-full bg-lime-50/50 p-2 text-lg underline underline-offset-2 backdrop-blur-lg"
			>Back</a
		>
		<span class="rounded-full bg-lime-50/50 p-2 text-lg backdrop-blur-lg"
			>{data.finishedSessions}/{data.startedSessions}</span
		>
		<button class="flex rounded-full bg-lime-50/50 p-2 text-2xl backdrop-blur-lg" on:click={share}
			><Share /></button
		>
	</header>
	<main>
		<h1 class="sr-only">Matcher</h1>
		<form method="post" use:enhance class="contents">
			<input type="hidden" name="previous" value={data.previous} />
			<input type="hidden" name="current" value={data.current} />
			<input type="hidden" name="winner" value="previous" />
			<button class="contents">
				<img
					src={`/images/food/${data.previous}.jpg`}
					alt={data.previous}
					class="h-screen-1/2 w-full object-cover"
				/>
			</button>
		</form>
		<form method="post" use:enhance class="contents">
			<input type="hidden" name="previous" value={data.previous} />
			<input type="hidden" name="current" value={data.current} />
			<input type="hidden" name="winner" value="current" />
			<button class="contents">
				<img
					src={`/images/food/${data.current}.jpg`}
					alt={data.current}
					class="h-screen-1/2 w-full object-cover"
				/>
			</button>
		</form>
	</main>
</div>
