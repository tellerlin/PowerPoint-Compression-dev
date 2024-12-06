<script lang="ts">
	export let progress = 0;
	export let status = '';
</script>

{#if progress > 0}
	<div class="mt-8">
		<div class="w-full bg-gray-200 rounded-full h-2">
			<div
				class="bg-primary h-2 rounded-full transition-all duration-300"
				style="width: {progress}%"
			/>
		</div>
		<p class="text-center mt-2 text-text-light">{status}</p>
	</div>
{/if}