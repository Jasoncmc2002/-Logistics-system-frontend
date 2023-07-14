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
		<div class="layout-container" style="width: 100%">
			<div class="page-header">
				<div class="am-container">
					<h1 class="page-header-title">公司动态</h1>
				</div>
			</div>

			<div class="breadcrumb-box">
				<div class="am-container">
					<ol class="am-breadcrumb">
						<li><router-link to="/companyindex">首页</router-link></li>
						<li class="am-active">公司动态</li>
					</ol>
				</div>
			</div>
		</div>

		<div class="section example">
			<div class="container" style="max-width: 1160px">
				<div class="section--header">
					<h2 class="section--title">最近新闻</h2>
					<p class="section--description">
						云适配与中建材信息技术股份有限公司（以下简称“中建信息”）联合举办的“战略
						<br>合作签约仪式暨全国跨屏行动启动大会”在北京成功举办。
					</p>
				</div>

				<div class="news-contaier">
					<div class="blog">
						<div class="am-g">
							<div class="am-u-lg-4 am-u-md-6 am-u-end" v-for="(article,index) in articles" :key="index">
								<div class="article">
									<div class="article-img">
										<img :src="article.cover" alt="" />
									</div>
									<div class="article-header">
										<h2><router-link :to="{name:'newsDetails',params:{newsId:article.articleId}}" rel="">{{article.title}}</router-link></h2>
										<ul class="article--meta">
											<li class="article--meta_item -date">{{article.createTime}}</li>
										</ul>
									</div>
									<div class="article--content">
										<p>{{article.introduction}}</p>
									</div>
									<div class="article--footer">
<!--										<router-link :to="{name:'newsDetails',params:{newsId:article.articleId}}" class="link">查看更多</router-link>-->
									</div>
								</div>
							</div>
						</div>

						<ul class="am-pagination" style="text-align: center;">
							<li :class="pageIndex === 1 ? 'am-disabled':''"
								@click="changeIndex(pageIndex - 1)">
								<a href="#">&laquo;</a>
							</li>

							<li v-for="(p,index) in articles.pages"
								:key="index"
								@click="changeIndex(p)"
								:class="pageIndex === p ? 'am-active':''">
								<a href="#">{{p}}</a>
							</li>

							<li :class="pageIndex === articles.pages ? 'am-disabled':''"
								@click="changeIndex(pageIndex + 1)">
								<a href="#">&raquo;</a>
							</li>
						</ul>
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

const articles = reactive([{
	articleId:1,
	title: "软英2001团队开发整体物流系统",
	cover:"https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg",
	introduction:"软英 2001 团队开发的整体物流系统，是一种基于人工智能和大数据技术的智能物流管理系统。该系统旨在提高物流效率和降低成本，可以帮助企业优化物流流程，提高物流安全性和准确性，并实现物流过程的可视化管理。通过该系统，企业可以更好地掌控物流状态，提高物流服务质量，增强企业市场竞争力。",
	content:"",
	createTime: '2020-12-27 23:17:17',
	contentHtml:"",
	author:"杨富超",
},{
	articleId:2,
	title: "帮助客户A运输货物",
	cover:"https://www.alsidt.com/public/uploads/20201003/d0b0b777240dadeb0e36656ceffa8d19.jpg",
	introduction:"帮助客户A更加高效地运输货物，提供更加安全、快捷、便捷的物流服务。通过物流公司的专业运输设备和智能化管理系统，客户A可以快速、准确地将货物运输到指定地点，避免了传统的货物运输过程中可能存在的各种问题，提高了货物的运输效率和安全性。同时，物流公司还可以通过提高物流服务质量和客户满意度来获得更多的客户。",
	content:"",
	createTime: '2020-12-27 23:17:17',
	contentHtml:"",
	author:"杨富超",
}]);
const pageIndex = reactive({
});
onMounted(()=>{
/*	getArticle(1);*/
});


/*function getArticle(pageIndex){
			this.getRequest(`/findArticles/${pageIndex}`).then(resp =>{
				if (resp){
					this.articles = resp.data.data
					console.log(this.articles)
				}
			})
		};*/
/*		changeIndex(p){
			if (p === 0){
				this.pageIndex = 1
			}else if (p === this.articles.pages + 1){
				this.pageIndex = this.articles.pages
			}else{
				this.pageIndex = p;
				this.getArticle(p)
			}
		}
	}*/
</script>

<style scoped>

</style>
