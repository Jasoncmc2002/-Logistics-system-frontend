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
					<h1 class="page-header-title">关于我们</h1>
				</div>
			</div>

			<div class="breadcrumb-box">
				<div class="am-container">
					<ol class="am-breadcrumb">
						<li><router-link to="/com">首页</router-link></li>
						<li class="am-active">关于我们</li>
					</ol>
				</div>
			</div>
		</div>


		<div class="section">
			<div class="container" style="max-width: 1160px">
				<div class="section--header">
					<h2 class="section--title">{{companyInfo.name}}</h2>
					<p class="section--description">{{companyInfo.introduction}}</p>
				</div>

				<div class="about-container">
					<div class="am-g">
						<div class="am-u-md-6">
							<div class="our-company-text">
								<h3>关于AI+智慧物流你需要知道哪些？</h3>
								<p>
									我们是一家基于 AI 智慧物流的公司，致力于提供全球最领先的物流解决方案。通过大数据分析和人工智能技术，我们能够实现物流过程的智能化和自动化，提高物流效率和降低成本。我们的产品和服务涵盖了物流领域的各个环节，为客户提供定制化的物流解决方案，让物流更加智能、高效、安全和可靠。
								</p>
								<p>
									从2020年至今，我们公司对接包括微软、联想等世界500强企业，光明网、中国青年报等知名媒体，清华、北大、中科大等知名大学，以及中国政府网、中国共产党网等政府机构。
								</p>
							</div>
						</div>

						<div class="am-u-md-6">
							<div class="our-company-quote">
								<div class="am-g">
									<div class="am-u-md-6">
										<div class="our-company-img">
											<img src="../../assets/images/about/yang.jpg" alt="" />
										</div>
									</div>

									<div class="am-u-md-6">
										<p class="our-company-brief">
											软件开发人才，国家级比赛多次获奖，进修MBA课程
										</p>
										<div class="our-company-quote_author"><strong>CEO：杨富超</strong><span>AI+智慧物流公司创始人</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--about-container end-->
			</div>
		</div>

		<hr class="section_divider -narrow">

		<div class="section">
			<div class="container" style="max-width: 1160px">
				<div class="section--header">
					<h2 class="section--title">我们的宗旨</h2>
					<p class="section--description">
						AI+物流，引领物流产业新势头
						<br>Everything  will be deal
					</p>
				</div>

				<div class="about-container">
					<div class="our-mission">
						<div class="am-g">
							<div class="am-u-md-3">
								<div class="our_mission--item">
									<div class="figure our_mission--item_media"><img src="../../assets/images/about/f02.jpg" alt=""></div>
									<h3 class="our_mission--item_title">品质</h3>
									<div class="our_mission--item_body">
										<p>
											全球领先的物流解决方案，安全高效解决物流配送问题
										</p>
										<ul>
											<li>快捷的物流配送</li>
											<li>统一的办公通讯门户</li>
											<li>完善的安全管理平台</li>
										</ul>
									</div>
								</div>
							</div>

							<div class="am-u-md-3">
								<div class="our_mission--item">
									<div class="figure our_mission--item_media"><img src="../../assets/images/about/f03.jpg" alt=""></div>
									<h3 class="our_mission--item_title">责任</h3>
									<div class="our_mission--item_body">
										<p>
											国产最流行的物流管理系统，为产业加速
										</p>
										<ul>
											<li>持续改进 </li>
											<li>追求卓越品质</li>
											<li>为顾客创造价值</li>
										</ul>
									</div>
								</div>
							</div>

							<div class="am-u-md-3">
								<div class="our_mission--item">
									<div class="figure our_mission--item_media"><img src="../../assets/images/about/f04.jpg" alt=""></div>
									<h3 class="our_mission--item_title">诚信</h3>
									<div class="our_mission--item_body">
										<p>
											与全球500+企业达成合作关系
										</p>
										<ul>
											<li>平等包容</li>
											<li>互利共赢</li>
											<li>与事业伙伴同成长</li>
										</ul>
									</div>
								</div>
							</div>

							<div class="am-u-md-3">
								<div class="our_mission--item">
									<div class="figure our_mission--item_media"><img src="../../assets/images/about/f01.jpg" alt=""></div>
									<h3 class="our_mission--item_title">高效</h3>
									<div class="our_mission--item_body">
										<p>
											以高效的服务，赢得客户良好的口碑
										</p>
										<ul>
											<li>高效的配送速度</li>
											<li>高效的管理架构</li>
											<li>高效的厂家供货</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<hr class="section_divider -narrow">


		<div class="section">
			<div class="container" style="max-width: 1160px">
				<div class="section--header">
					<h2 class="section--title">我们的团队</h2>
					<p class="section--description">
						成员既有超级学霸（来自Harvard、Google、香港科技大学、中国科技大学），
						<br>也有来自行业的技术大拿。
					</p>
				</div>

				<div class="about-container">
					<div class="our-team">
						<div class="am-g">
							<div class="am-u-md-3 am-u-end" v-for="(designer,index) in designers" :key="index">
								<div class="team-box">
									<div class="our-team-img" style="height: 304px;overflow: hidden">
										<img :src="designer.avatar" style="height: auto" alt=""/>
									</div>
									<div class="team_member--body">
										<h3 class="team_member--name">{{designer.name}}</h3>
										<span class="team_member--position">{{designer.content}}</span>
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
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">家用电梯</router-link></li>
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">别墅电梯</router-link></li>
								<li class="footer_navigation--item"><router-link to="/product" class="footer_navigation--link">观光电梯</router-link></li>
							</ul>
						</div>
					</div>
					<div class="am-u-md-6 ">
						<div class="footer_main--column">
							<strong class="footer_main--column_title">关于我们</strong>
							<div class="footer_about">
								<p class="footer_about--text">
									云适配(AllMobilize Inc.) 是全球领先的HTML5企业移动化解决方案供应商，由前微软美国总部IE浏览器核心研发团队成员及移动互联网行业专家在美国西雅图创立.
								</p>
							</div>
						</div>
					</div>
					<div class="am-u-md-3 ">
						<div class="footer_main--column">
							<strong class="footer_main--column_title">联系详情</strong>
							<ul class="footer_contact_info">
								<li class="footer_contact_info--item"><i class="am-icon-phone"></i><span>服务专线：15284734274</span></li>
								<li class="footer_contact_info--item"><i class="am-icon-map-marker"></i><span>四川省成都市高新区</span></li>
								<li class="footer_contact_info--item"><i class="am-icon-clock-o"></i><span>周一 ~ 周日, 8:00 - 23:00 </span></li>
							</ul>
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

<script  setup>
import '@/assets/css/style.css'

const companyInfo = reactive({
	name: '智慧物流公司',
	introduction:"智慧物流公司是一家专注于物流信息化和智能化的公司，通过技术创新和资源整合，为物流从业者提供更高效、更安全、更智慧的物流解决方案。"
});
const designers = reactive([{
	name:"CEO：杨富超",
	avatar:"https://img95.699pic.com/photo/50162/5637.jpg_wh300.jpg",
	content:"物流经典方式是通过代理人完成。目前，代理人不同的技术选择与物流方式有关。希腊神话也是因为通过代理人完成的物流经典方式，其技术选择与物流方式有关。",
},{
	name:"CEO：杨富超",
	avatar:"https://img95.699pic.com/photo/50162/5637.jpg_wh300.jpg",
	content:"物流经典方式是通过代理人完成。目前，代理人不同的技术选择与物流方式有关。希腊神话也是因为通过代理人完成的物流经典方式，其技术选择与物流方式有关。",
},]);

</script>

<style scoped>

</style>
