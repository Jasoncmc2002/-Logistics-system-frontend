<template>
	<main class="page-wrapper">
		<Header/>

		<div class="main-content">
			<slot></slot>
		</div>

		<Footer/>
	</main>
</template>

<script setup lang="ts">
import AppFunctions from "@/utils/AppFunctions";

function 	toggleStickyHeader() {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 100) {
		AppFunctions.addClass('.header-default', 'sticky');
	} else if (scrolled <= 100) {
		AppFunctions.removeClass('.header-default', 'sticky');
	}
};
window.addEventListener('scroll', toggleStickyHeader);
onMounted(() => {
	toggleStickyHeader();
});
onBeforeUnmount(() => {
	window.removeEventListener('scroll', toggleStickyHeader);
});
</script>
<style scoped>
.main-content{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
