<template lang="pug">
  //- .theme-container(:class="pageClasses")
  .theme-container
    Header.fade-in.move-up.animation.js-animate

    Home(v-if="$page.frontmatter.home")

    .layout(v-else)
      header.container.container--content.post-header(v-if="$page.frontmatter.type == 'post'")
        h1 {{ $frontmatter.title }}
        .post-date(v-if="$frontmatter.updatedDate") {{ formatDate($frontmatter.date) }}<br>
          | Updated: {{ formatDate($frontmatter.updatedDate) }}
        .post-date(v-else) {{ formatDate($frontmatter.date) }}
        .post-media(v-if="$frontmatter.image")
          img(:src="'/images/articles/' + $frontmatter.image" alt="$frontmatter.imageAlt" loading="lazy")

      Content.container.container--content.rte(v-if="$page.frontmatter.type == 'post'")
      Content.container(v-else)

    //- window.location.href is not working
    //- SocialShare(v-if="$page.frontmatter.type == 'article'")

    Footer.fade-in.move-up.animation.js-animate
</template>

<script>
import Home from '@theme/components/Home.vue'
import Footer from '@theme/components/Footer.vue'
import Header from '@theme/components/Header.vue'
// import Page from '@theme/components/Page.vue'
// import Sidebar from '@theme/components/Sidebar.vue'
// import SocialShare from '@theme/components/SocialShare.vue'
// import { resolveSidebarItems } from '../util'

export default {
  name: 'Layout',
  components: {
    Home,
    // Page,
    // Sidebar,
    Footer,
    Header,
    // SocialShare
  },
  data () {
    return {}
  },
  // computed: {
  //   pageClasses () {
  //     const userPageClass = this.$page.frontmatter.pageClass
  //     return [
  //       {
  //         'no-navbar': !this.shouldShowNavbar,
  //         'sidebar-open': this.isSidebarOpen,
  //         'no-sidebar': !this.shouldShowSidebar
  //       },
  //       userPageClass
  //     ]
  //   }
  // },
  methods: {
    formatDate(currentDate) {
      return currentDate.substring(0, 10)
    }
  }
}
</script>

<style lang="stylus">
  .post-header
    margin-bottom 50px
  .post-media
    margin-top 20px
</style>
