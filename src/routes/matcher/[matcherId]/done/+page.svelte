<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import Share from "$lib/icons/share.svelte";

	export let data;

	const share = async () => {
		const shareData = {
			text: "Match food with your friends!",
			url: $page.url.href.replace("/done", ""),
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
	<header class="flex w-full items-center justify-between p-2">
		<a href="/" class="p-2 text-lg underline underline-offset-2">Back</a>
		<span class="p-2 text-lg">{data.finishedSessions}/{data.startedSessions}</span>
		<button class="flex rounded-full p-2 text-2xl" on:click={share}><Share /></button>
	</header>
	<main class="flex h-screen flex-col items-center justify-between p-8">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl">Done reviewing!</h1>
			{#if data.startedSessions - data.finishedSessions === 0}
				{#if data.creator}
					<p>Everyone's done, you can finish the session now.</p>
				{:else}
					<p>Everyone's done, wait for the host to finish the session or invite more friends.</p>
				{/if}
			{:else}
				<p>
					Still waiting for <span>{data.startedSessions - data.finishedSessions}</span> people to finish
					their sessions.
				</p>
				{#if data.creator}
					<p>
						You can force finish the session now, but they won't be able to review their results.
					</p>
				{/if}
			{/if}
		</div>
		<div class="flex w-full flex-col gap-2">
			<button
				on:click={share}
				class="rounded-full bg-lime-500 px-3 py-2 text-xl text-lime-50 shadow-lg drop-shadow-sm"
				>Invite friends</button
			>
			{#if data.creator}
				<form use:enhance method="post" class="contents">
					<button
						class="rounded-full bg-red-500 px-3 py-2 text-xl text-red-50 shadow-lg drop-shadow-sm"
						>Finish now</button
					>
				</form>
			{/if}
		</div>
	</main>
</div>
