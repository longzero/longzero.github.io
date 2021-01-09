<template lang="pug">
  .container.container--fluid.layout-2
    .column-main
      Posts(type="articles")
    .column-sidebar
      .h-position-sticky

        h3 Tumblelogs
          span.info-bubble
            span.info-bubble-symbol ?
            .info-bubble-details
              p The idea was to create a section for micro-blogging and I discovered these micro posts are called tumblelogs, since 2005.
              blockquote
                p A tumblelog is a quick and dirty stream of consciousness [...]. They remind me of an older style of blogging, back when people did sites by hand, [...] really just a way to quickly publish the "stuff" that you run across every day on the web.
                p
                  a(target="_blank" href="https://kottke.org/05/10/tumblelogs")
                    strong
                      em Jason Kottke, October 19, 2005
        Posts(type="tumblelogs")
        //- https://help.twitter.com/en/using-twitter/embed-twitter-feed
        //- https://publish.twitter.com/?lang=en&query=https%3A%2F%2Ftwitter.com%2Flongzero&theme=light&widget=Timeline
        //- https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview
        //-
          Access token
          6390832-eUdqt4nf40jJrj89Qbba3rUZpDwTug8eIx9s6ZlYYf
          Access token secret
          kPsFCF5De2koqUD2nCetwrN22JO7kgmoUs5mSVDj0z3cg
          Bearer token
          AAAAAAAAAAAAAAAAAAAAAC8JAgAAAAAAMry1dEXxeOMCpAoEB6pEeKot6tQ%3DVMlgEU6InKyncjvau5ItMbNtyd5Sq1awYlp2vNKZje6IInLWZP
        //- .twitter-widget
          a(class="twitter-timeline" data-tweet-limit="9" data-lang="en" data-theme="light" data-chrome="noheader transparent" href="https://twitter.com/Longzero?ref_src=twsrc%5Etfw")
          script(async src="https://platform.twitter.com/widgets.js" charset="utf-8")
</template>

<script>
  // import SocialShareLink from '@theme/components/SocialShareLink.vue'
  export default {
    components: {
      // SocialShareLink
    }
  }
</script>

<style lang="stylus">
  @require '../styles/partials/variables'
  @require '../styles/partials/home'
</style>
