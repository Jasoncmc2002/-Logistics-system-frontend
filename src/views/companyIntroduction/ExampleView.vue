<template>
	<main class="page-wrapper">
		<div class="header-wrapper" >
			<div class="header">
				<div class="header-left">
					<img src="../../assets/images/logo.png" alt="">
				</div>
				<div class="header-mid">
					<div class="header-item">
						<i style="color:#7c6aa6" class="contact-icon am-icon-phone"></i>
						<div class="item">
							<strong>18540037135</strong>
							<span>周一 ~ 周五, 8:30 - 17:30</span>
						</div>
					</div>
					<div class="header-item">
						<i style="color:#7c6aa6" class="contact-icon am-icon-map-marker"></i>
						<div class="item">
							<strong>辽宁省沈阳市浑南区</strong>
							<span>辽宁省 AI+智慧物流</span>
						</div>
					</div>
				</div>
				<div class="header-right">

						<button  type="button"  ><router-link class="router" to="/login">立马使用</router-link></button>

				</div>
			</div>

			<div class="nav-wrapper header-default">
				<div class="nav">
					<ul class="am-nav am-nav-pills am-nav-justify">
						<li><router-link class="router" to="/companyindex">网站首页</router-link></li>
						<li><router-link class="router" to="/product">产品中心</router-link></li>
						<li><router-link class="router" to="/example">客户案例</router-link></li>
						<li><router-link class="router" to="/news">公司动态</router-link></li>
						<li><router-link class="router" to="/about">关于我们</router-link></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="main-content">
			<slot></slot>

		<div class="layout-container" style="width: 100%">
			<div class="page-header">
				<div class="am-container">
					<h1 class="page-header-title">客户案例</h1>
				</div>
			</div>
			<div class="breadcrumb-box">
				<div class="am-container">
					<ol class="am-breadcrumb">
						<li><router-link to="/companyindex">首页</router-link></li>
						<li class="am-active">客户案例</li>
					</ol>
				</div>
			</div>
		</div>

		<div class="section example">
			<div class="container" style="max-width: 1160px; margin: 0 auto">
				<div class="section--header">
					<h2 class="section--title">AI+帮助客户解决痛点问题</h2>
					<p class="section--description">
						智慧物流企业级解决方案是指物流企业在提供物流服务的同时，通过智能化技术和平台，实现对物流运输过程的智能化管理和优化，从而提高物流效率和服务质量，降低物流成本，提升客户满意度。通过智慧物流企业级解决方案，物流企业可以实现对货物的全程监控和管理，实现对货物的智能调度和优化，从而提高物流效率和服务质量，降低物流成本，提升客户满意度。
					</p>
				</div>

				<div class="example-container">
					<div class="am-tabs">
						<ul class="am-tabs-nav am-nav am-nav-tabs am-g">
							<li class="am-u-md-2"
								v-for="(tab,index) in tabList"
								:key="index"
								@click.prevent="changeTab(index)"
								:class="tabIndex === index ? 'am-active':''">
								<a href="#"><i :class="tab.icon"></i>{{tab.name}}</a>
							</li>
						</ul>

						<div class="tabs">
							<div class="tab" v-for="(image,index) in list" :key="index">
								<img :src="image.image" alt="">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>

		<div class="footer">
			<div style="background-color:#383d61" class="footer--bg"></div>
			<div class="footer--inner">
				<div class="am-g">
					<div class="am-u-md-3 ">
						<div class="footer_main--column">
							<strong class="footer_main--column_title">产品中心</strong>
							<ul class="footer_navigation">
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">日常物流运输</router-link></li>
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">BI数据分析</router-link></li>
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">国际物流运输</router-link></li>
							</ul>
						</div>
					</div>
					<div class="am-u-md-6 ">
						<div class="footer_main--column">
							<strong class="footer_main--column_title">关于我们</strong>
							<div class="footer_about">
								<p class="footer_about--text">
									AI+智慧物流公司的服务主要体现在物流信息化、智能物流园区、物流信息化平台、智能物流机器人等方面的服务，通过提高物流效率，降低物流成本，提供更加便捷、高效的物流服务，来满足客户的需求。
								</p>
							</div>
						</div>
					</div>
					<div class="am-u-md-3 ">
						<div class="footer_main--column">
							<strong class="footer_main--column_title">联系详情</strong>
							<ul class="footer_contact_info">
								<li class="footer_contact_info--item"><i class="am-icon-phone"></i><span>服务专线：15284734274</span></li>
								<li class="footer_contact_info--item"><i class="am-icon-map-marker"></i><span>辽宁省沈阳市浑南区</span></li>
								<li class="footer_contact_info--item"><i class="am-icon-clock-o"></i><span>周一 ~ 周日, 8:00 - 23:00 </span></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import '@/assets/css/style.css'

const tabList = reactive([
	{id:1,name:'主要案例',icon:'am-icon-map-o'},
]);

const tabIndex=reactive(0);
const list=reactive([{image:"https://www.alsidt.com/public/uploads/20201003/42835265b591791c3f5e15917f437763.jpg"},{image:"https://www.alsidt.com/public/uploads/20201003/42835265b591791c3f5e15917f437763.jpg"}]);


</script>

<style scoped>

</style>
