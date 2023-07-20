<script setup>
import '@/assets/css/style.css'
import AppFunctions from "@/utils/AppFunctions";

//ssss

onMounted(() => {
	toggleStickyHeader();
	window.addEventListener('scroll', toggleStickyHeader);
});
onBeforeUnmount(() => {
	window.removeEventListener('scroll', toggleStickyHeader);
});
const tabList = reactive([
	{name:'一体化管理', desc:'线上线下一体式管理，提高门店管理效率。', icon:'am-icon-cog'},
	{name:'优质的服务体验', desc:'实现自助化的物流服务，提高客户满意度。', icon:'am-icon-lightbulb-o'},
	{name:'基于ChatGPT 的智能 Bi 分析', desc:'能够对用户行为、经营状态提供系统性分析', icon:'am-icon-line-chart'},
]);
const toggleStickyHeader=() =>  {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 100) {
		AppFunctions.addClass('.header-default', 'sticky');
	} else if (scrolled <= 100) {
		AppFunctions.removeClass('.header-default', 'sticky');
	}
};
const tabIndex =reactive(0);
const slideshow =reactive([{imageUrl:"https://img0.baidu.com/it/u=4251574947,2046716778&fm=253&fmt=auto&app=138&f=JPEG"},{imageUrl:"https://www.alsidt.com/public/uploads/20200924/40b2d69f2f89c991a6787925ea468df1.jpg"}]);
const advantageLis=reactive([
	{id:1,cover:'../assets/images/index/f01.jpg',title:'简单的适配过程',desc:'用户可快速学习适配开发，通过丰富的组件库完成页面功能的移动化适配。'},
	{id:2,cover:'../assets/images/index/f01.jpg',title:'简单的适配过程',desc:'用户可快速学习适配开发，通过丰富的组件库完成页面功能的移动化适配。'},
	{id:3,cover:'../assets/images/index/f01.jpg',title:'简单的适配过程',desc:'用户可快速学习适配开发，通过丰富的组件库完成页面功能的移动化适配。'},
	{id:4,cover:'../assets/images/index/f01.jpg',title:'简单的适配过程',desc:'用户可快速学习适配开发，通过丰富的组件库完成页面功能的移动化适配。'},
]);
const	serviceList=reactive([
				{id:1,icon:'am-icon-diamond',title:'日均1000+的订单量',desc:'日均 1000+订单量是一个不小的规模，意味着我们能够提供高效、快捷、安全的物流服务，满足客户的需求。'},
				{id:2,icon:'am-icon-user',title:'国内顶尖高校的物流人才',desc:'国内顶尖高校的物流人才是我们公司的重要资源，他们的专业知识和丰富经验能够为公司的发展提供有力支持。'},
				{id:3,icon:'am-icon-umbrella',title:'安全的客户隐私保护',desc:'安全的客户隐私保护是我们公司的重要承诺，我们将采取各种措施确保客户隐私得到最大程度的保护。'},
				{id:4,icon:'am-icon-briefcase',title:'高效的物流速度',desc:'高效的物流速度是我们公司的重要承诺，我们将采取各种措施确保物流速度得到最大程度的提升。'}
			]);
function 	changeTab(index){
			this.tabIndex.value = index;
	};
</script>
<style scoped>
.main-content{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
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
				<div style="width: 100%">
					<div class="index-page">
						<div data-am-widget="tabs" class="am-tabs am-tabs-default">
							<div class="am-tabs-bd">
								<div
										class="am-tab-panel am-active"
										v-if="slideshow.length > 0"
										:style="{ backgroundImage: `url(${slideshow[tabIndex].imageUrl})`}"
								>
									<div class="index-banner">
										<div class="index-mask">
											<div class="container">
												<div class="am-g">
													<div class="am-u-md-10 am-u-sm-centered" style="text-align: center">
														<h1 class="slide_simple--title">智慧物流，AI 助力</h1>
														<p class="slide_simple--text am-text-left" style="display: flex;justify-content: center">
															我们是一家基于 AI 智慧物流的公司，致力于提供全球最领先的物流解决方案。通过大数据分析和人工智能技术，我们能够实现物流过程的智能化和自动化，提高物流效率和降低成本。我们的产品和服务涵盖了物流领域的各个环节，为客户提供定制化的物流解决方案，让物流更加智能、高效、安全和可靠。
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<ul class="am-tabs-nav am-cf index-tab">
								<li v-for="(tab, index) in tabList" :key="index" :class="tabIndex === index ? 'am-active' : ''">
									<a href="#" @click.prevent="changeTab(index)">
										<div class="am-u-md-3 am-u-sm-3 am-padding-right-0">
											<i :class="tab.icon"></i>
										</div>
										<div class="school-item-right am-u-md-9 am-u-sm-9 am-text-left">
											<strong class="promo_slider_nav--item_title">{{ tab.name }}</strong>
											<p class="promo_slider_nav--item_description" style="width: 400px">{{ tab.desc }}</p>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="section">
					<div class="container" style="max-width: 1160px;">
						<div class="section--header">
							<h2 class="section--title">核心优势</h2>
							<p class="section--description">
								采用先进的信息技术，如人工智能、大数据分析、物联网等，实现对物流过程的智能化管理，提高物流效率和降低成本。							</p>
							<p class="section--description">
								通过智能化技术实现优质的服务体验，例如实现自助化的物流服务，提高客户满意度和忠诚度。				</p>
						<p class="section--description">
							 通过大数据分析，对物流数据进行深入分析和理解，从而得出精准的物流预测和决策，提高物流效率和降低成本。				</p>		</div>

						<div class="index-container">
							<div class="am-g">
								<div class="am-u-md-3" v-for="(advantage, index) in advantageList" :key="index">
									<div class="features_item">
										<img :src="advantage.cover" alt="">
										<h3 class="features_item--title">{{ advantage.title }}</h3>
										<p class="features_item--text">{{ advantage.desc }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="section" style="  border-bottom: 1px solid #e9e9e9; padding-top: 0">
					<div class="container" style="max-width: 1160px;">
						<div class="section--header">
							<h2 class="section--title">我们的服务</h2>
							<p class="section--description">
								智慧物流公司的服务主要体现在物流信息化、智能物流园区、物流信息化平台、智能物流机器人等方面的服务，通过提高物流效率，降低物流成本，提供更加便捷、高效的物流服务，来满足客户的需求。
							</p>
						</div>

						<div class="index-container">
							<div class="am-g">
								<div class="am-u-md-3" v-for="(service, index) in serviceList" :key="index">
									<div class="service_item">
										<i class="service_item--icon" :class="service.icon"></i>
										<h3 class="service_item--title">{{ service.title }}</h3>
										<div class="service_item--text">
											<p>{{ service.desc }}</p>
										</div>
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
