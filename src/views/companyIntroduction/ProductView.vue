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

						<button  type="button"  ><router-link class="router" to="/index">立马使用</router-link></button>

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
		<!--<div class="product-background"></div>-->
		<div class="layout-container" style="width: 100%">
			<div class="solution-page">
				<div class="container" style="text-align: center">
					<h2>AI+智慧物流企业级解决方案</h2>
					<p>智慧物流企业级解决方案是指物流企业在数字化转型升级的背景下，通过智能化、大数据、人工智能等技术手段，提高物流效率、降低物流成本、提高客户满意度等目标，实现物流企业的高质量发展。</p>
				</div>
			</div>
		</div>
		<div class="layout-container" style="width: 100%">
			<div class="breadcrumb-box">
				<div class="am-container">
					<ol class="am-breadcrumb">
						<li><router-link to="/companyindex">首页</router-link></li>
						<li class="am-active">产品中心</li>
					</ol>
				</div>
			</div>
		</div>

		<div class="section" style="">
			<div class="container" style="max-width: 1160px">
				<div class="section--header">
					<h2 class="section--title">解决方案案例展示</h2>
					<p class="section--description">
						全球独创专利技术：一行代码部署，帮助企业快速安全地将现有PC版网页适配成HTML5跨屏网页，跨平台的企业统一办公 门户，快捷的移动适配开发能力，完备的数据安全保护
					</p>
				</div>

				<div class="solution-container">
					<div data-am-widget="tabs" class="am-tabs ">
						<ul class="am-tabs-nav am-cf">
							<li v-for="(tab,index) in tabList"
								:key="index"
								@click.prevent="changeTab(index,tab.typeId)"
								:class="tabIndex === index ? 'am-active':''">
								<a href="#">{{tab.typeName}}</a>
							</li>
						</ul>
						<div class="am-tabs-bd">
							<div class=am-tabs-tab>
								<div class="am-tab"
									v-for="(goods,index) in goodsList[tabIndex]"
									:key="index"
									@click="handleDetails(goods.typeDetaisId)">
									<img :src="goods.imageUrl1" alt="">
									<p>{{goods.title}}</p>
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

<script setup>
import '@/assets/css/style.css'

const tabList = reactive([
	{typeId:1,typeName:'一体化管理'},
	{typeId:2,typeName:'日常物流运输'},
	{typeId:3,typeName:'BI数据分析'},
]);
const list = reactive([]);
let tabIndex = reactive(0);
const goodsList = reactive([
		[{typeDetaisId:1,title:"线上线下一体式管理，提高门店管理效率。",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}],
		[{typeDetaisId:2,title:"日均 1000+订单量是一个不小的规模，意味着我们能够提供高效、快捷、安全的物流服务，满足客户的需求。",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}],
		[{typeDetaisId:3,title:"基于ChatGPT，能够对用户行为、经营状态提供系统性分析",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}],
]);
// const goodsListAll = reactive([
// 	{data: [{typeDetaisId:1,title:"线上线下一体式管理，提高门店管理效率。",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}]},
// 	{data: [{typeDetaisId:2,title:"日均 1000+订单量是一个不小的规模，意味着我们能够提供高效、快捷、安全的物流服务，满足客户的需求。",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}]},
// 	{data: [{typeDetaisId:3,title:"基于ChatGPT，能够对用户行为、经营状态提供系统性分析",imageUrl1:'https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg'}]},
// ]);
onMounted(()=>{
	// getGoodsList(1);
});

function	changeTab(index,typeId){
			tabIndex = index;
			console.log(typeId);
			// getGoodsList(typeId)
};
// function	getGoodsList(typeId) {
//
// 	goodsList.value = goodsListAll.get(typeId).data.value;
// 	console.log(goodsListAll[typeId].data);
// };
function	handleDetails(productId){
			this.$router.push({path:`/product/productId/${productId}`});
};

</script>

