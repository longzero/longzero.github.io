(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{237:function(t,e,a){},238:function(t,e,a){},239:function(t,e,a){},240:function(t,e,a){"use strict";a(237)},241:function(t,e,a){"use strict";a(238)},242:function(t,e,a){"use strict";a(239)},243:function(t,e,a){"use strict";var s={components:{}},i=(a(240),a(13)),n=Object(i.a)(s,(function(){var t=this._self._c;return t("div",{staticClass:"container container--fluid"},[t("Posts",{attrs:{type:"articles"}})],1)}),[],!1,null,null,null);e.a=n.exports},244:function(t,e,a){"use strict";var s={data:()=>({})},i=(a(241),a(13)),n=Object(i.a)(s,(function(){this._self._c;return this._m(0)}),[function(){var t=this._self._c;return t("footer",{staticClass:"site-footer"},[t("div",{staticClass:"container container--content"},[t("p",[this._v("Reach me by email "),t("strong",[t("a",{attrs:{target:"_blank",href:"mailto:long@longzero.com?body=(From%20longzero.com,%20do%20not%20delete%20this%20line)"}},[this._v("long@longzero.com")])]),this._v(".")]),t("p",[this._v("You can also try "),t("a",{attrs:{target:"blank",href:"https://twitter.com/longzero",title:"@longzero"}},[this._v("Twitter")]),this._v(", which I might prefer.")])])])}],!1,null,null,null);e.a=n.exports},245:function(t,e,a){"use strict";var s=a(246),i=a(259);function n(t,e){return t.ownerDocument.defaultView.getComputedStyle(t,null)[e]}var r={name:"Navbar",components:{NavLinks:a(258).a,SearchBox:i.a,AlgoliaSearchBox:s.a},data:()=>({linksWrapMaxWidth:null}),computed:{algolia(){return this.$themeLocaleConfig.algolia||this.$site.themeConfig.algolia||{}},isAlgoliaSearch(){return this.algolia&&this.algolia.apiKey&&this.algolia.indexName}},mounted(){const t=parseInt(n(this.$el,"paddingLeft"))+parseInt(n(this.$el,"paddingRight")),e=()=>{document.documentElement.clientWidth<719?this.linksWrapMaxWidth=null:this.linksWrapMaxWidth=this.$el.offsetWidth-t-(this.$refs.siteName&&this.$refs.siteName.offsetWidth||0)};e(),window.addEventListener("resize",e,!1)}},o=(a(242),a(13)),l=Object(o.a)(r,(function(){var t=this,e=t._self._c;return e("header",{staticClass:"site-header"},[e("div",{staticClass:"container container--fluid"},[e("RouterLink",{staticClass:"home-link",attrs:{to:t.$localePath}},[e("span",{staticClass:"site-name"},[e("strong",[t._v("long")]),t._v(" "),e("span",{staticClass:"site-name-switch"},[e("span",{staticClass:"site-name-main"},[t._v("zero")]),t._v(" "),e("span",{staticClass:"site-name-alternate"},[t._v("nguyen")])])])]),t._v(" "),e("div",{staticClass:"header-links"},[e("NavLinks",{staticClass:"site-navigation can-hide"}),t._v(" "),t.isAlgoliaSearch?e("AlgoliaSearchBox",{attrs:{options:t.algolia}}):!1!==t.$site.themeConfig.search&&!1!==t.$page.frontmatter.search?e("SearchBox"):t._e(),t._v(" "),e("div",{staticClass:"social-networks"},[e("a",{staticClass:"social-link",attrs:{target:"_blank",href:"https://fb.com/longzerodesign",rel:"me"}},[e("svg",{attrs:{viewBox:"0 0 19 19",width:"19",height:"19",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"M19 9.558C19 4.28 14.747 0 9.5 0S0 4.28 0 9.558c0 4.77 3.474 8.725 8.016 9.442v-6.68H5.604V9.559h2.412V7.452c0-2.395 1.418-3.718 3.588-3.718 1.04 0 2.126.186 2.126.186v2.352h-1.197c-1.18 0-1.549.737-1.549 1.493v1.793h2.635l-.421 2.763h-2.214V19C15.526 18.283 19 14.329 19 9.558",fill:"#3A3A3A","fill-rule":"evenodd"}})])]),t._v(" "),e("a",{staticClass:"social-link",attrs:{target:"_blank",href:"https://instagram.com/longzero",rel:"me"}},[e("svg",{attrs:{viewBox:"0 0 22 22",width:"22",height:"22",fill:"none",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"M11 5.61c-3 0-5.39 2.437-5.39 5.39 0 3 2.39 5.39 5.39 5.39 2.953 0 5.39-2.39 5.39-5.39 0-2.953-2.437-5.39-5.39-5.39zm0 8.906A3.51 3.51 0 017.484 11c0-1.922 1.547-3.469 3.516-3.469A3.46 3.46 0 0114.469 11c0 1.969-1.547 3.516-3.469 3.516zm6.844-9.094a1.26 1.26 0 00-1.266-1.266 1.26 1.26 0 00-1.265 1.266 1.26 1.26 0 001.265 1.266 1.26 1.26 0 001.266-1.266zm3.562 1.266C21.313 5 20.938 3.5 19.72 2.28 18.5 1.062 17 .687 15.312.594 13.579.5 8.375.5 6.642.594 4.953.688 3.5 1.063 2.234 2.28 1.016 3.5.641 5 .547 6.687c-.094 1.735-.094 6.938 0 8.672.094 1.688.469 3.141 1.687 4.407 1.266 1.218 2.72 1.593 4.407 1.687 1.734.094 6.937.094 8.671 0 1.688-.094 3.188-.469 4.407-1.687 1.218-1.266 1.593-2.72 1.687-4.407.094-1.734.094-6.937 0-8.671zm-2.25 10.5c-.328.937-1.078 1.64-1.968 2.015-1.407.563-4.688.422-6.188.422-1.547 0-4.828.14-6.188-.422a3.554 3.554 0 01-2.015-2.015c-.563-1.36-.422-4.641-.422-6.188 0-1.5-.14-4.781.422-6.188a3.616 3.616 0 012.015-1.968c1.36-.563 4.641-.422 6.188-.422 1.5 0 4.781-.14 6.188.422.89.328 1.593 1.078 1.968 1.969.563 1.406.422 4.687.422 6.187 0 1.547.14 4.828-.422 6.188z",fill:"#231F20"}})])]),t._v(" "),e("a",{staticClass:"social-link social-link--mastodon",attrs:{target:"_blank",href:"https://mastodon.world/@longzero",rel:"me"}},[e("svg",{attrs:{viewBox:"0 0 321 345",xmlns:"http://www.w3.org/2000/svg",width:"321",height:"345",fill:"none"}},[e("path",{attrs:{fill:"#3088D4",d:"M313 207c-5 24-43 50-85 56-86 11-137-6-137-6 3 13-4 54 70 52 31 0 58-7 58-7l2 27c-51 24-107 15-140 6-67-17-79-90-81-162v-59c0-74 49-96 49-96C99-6 229-4 271 18c0 0 49 22 49 96 0 0 1 55-7 93Z"}}),t._v(" "),e("path",{staticClass:"social-icon-mastodon",attrs:{fill:"#369",d:"M262 119v91h-35v-88c0-18-8-27-23-27-18 0-27 11-27 33v47h-34v-47c0-22-9-33-27-33-15 0-23 9-23 27v88H58v-91c0-18 5-60 52-60 39 0 50 37 50 37s10-37 50-37c45 0 52 42 52 60Z"}})])]),t._v(" "),e("a",{staticClass:"social-link",attrs:{target:"_blank",href:"https://twitter.com/longzero",rel:"me"}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z"}})])]),t._v(" "),e("a",{staticClass:"social-link",attrs:{target:"_blank",href:"https://youtube.com/longzero",rel:"me"}},[e("svg",{attrs:{viewBox:"0 0 26 18",width:"26",height:"18",fill:"none",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"M25.234 2.86c-.28-1.126-1.172-2.016-2.25-2.297C20.97 0 13 0 13 0S4.984 0 2.969.563C1.89.843 1 1.734.719 2.858.156 4.83.156 9.047.156 9.047s0 4.172.563 6.187a3.127 3.127 0 002.25 2.25C4.984 18 13 18 13 18s7.969 0 9.984-.516a3.127 3.127 0 002.25-2.25c.563-2.015.563-6.187.563-6.187s0-4.219-.563-6.188zm-14.859 9.984V5.25l6.656 3.797-6.656 3.797z",fill:"#231F20"}})])])])],1)],1)])}),[],!1,null,null,null);e.a=l.exports},252:function(t,e,a){},253:function(t,e,a){},276:function(t,e,a){"use strict";a(252)},277:function(t,e,a){"use strict";a(253)},282:function(t,e,a){"use strict";a.r(e);var s=a(243),i=a(244),n=a(245),r={props:["network"],computed:{currentUrl(){return this.$themeConfig.domain+this.$page.path}},methods:{getShareUrl(t){return"facebook"===t?"https://www.facebook.com/sharer/sharer.php?u="+this.currentUrl:"linkedin"===t?"https://www.linkedin.com/shareArticle?mini=true&url="+this.currentUrl+"&title=&summary=&source=":"pinterest"===t?"https://pinterest.com/pin/create/button/?url="+this.currentUrl+"&media=&description=":"twitter"===t?"https://twitter.com/intent/tweet?url="+this.currentUrl+"&text=":void 0}}},o=a(13),l={components:{SocialShareLink:Object(o.a)(r,(function(){var t=this._self._c;return t("a",{staticClass:"social-link",attrs:{target:"_blank",href:this.getShareUrl(this.network)}},["facebook"==this.network?t("svg",{attrs:{viewBox:"0 0 19 19",width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg"}},[t("path",{attrs:{d:"M19 9.558C19 4.28 14.747 0 9.5 0S0 4.28 0 9.558c0 4.77 3.474 8.725 8.016 9.442v-6.68H5.604V9.559h2.412V7.452c0-2.395 1.418-3.718 3.588-3.718 1.04 0 2.126.186 2.126.186v2.352h-1.197c-1.18 0-1.549.737-1.549 1.493v1.793h2.635l-.421 2.763h-2.214V19C15.526 18.283 19 14.329 19 9.558",fill:"#3A3A3A","fill-rule":"evenodd"}})]):"linkedin"==this.network?t("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg"}},[t("path",{attrs:{d:"M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"}})]):"pinterest"==this.network?t("svg",{attrs:{viewBox:"0 0 19 24",width:"19",height:"24",fill:"none",xmlns:"http://www.w3.org/2000/svg"}},[t("path",{attrs:{d:"M10.063.328C5.234.328.5 3.516.5 8.718c0 3.282 1.828 5.157 2.953 5.157.469 0 .75-1.266.75-1.64 0-.422-1.125-1.36-1.125-3.188 0-3.75 2.86-6.422 6.563-6.422 3.234 0 5.578 1.828 5.578 5.156 0 2.485-.985 7.125-4.219 7.125-1.172 0-2.203-.844-2.203-2.015 0-1.782 1.265-3.516 1.265-5.344 0-3.094-4.406-2.531-4.406 1.219 0 .796.094 1.64.469 2.39-.656 2.766-1.969 6.938-1.969 9.797 0 .89.094 1.735.188 2.625.14.188.093.188.328.094 2.344-3.235 2.297-3.89 3.328-8.11.61 1.079 2.063 1.688 3.281 1.688 4.969 0 7.219-4.875 7.219-9.234 0-4.641-4.031-7.688-8.438-7.688z",fill:"#231F20"}})]):"twitter"==this.network?t("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg"}},[t("path",{attrs:{d:"M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z"}})]):this._e()])}),[],!1,null,null,null).exports}},c=(a(276),Object(o.a)(l,(function(){var t=this._self._c;return t("div",{staticClass:"container container--content social-sharing"},[this._m(0),t("SocialShareLink",{attrs:{network:"facebook"}}),t("SocialShareLink",{attrs:{network:"linkedin"}}),t("SocialShareLink",{attrs:{network:"pinterest"}}),t("SocialShareLink",{attrs:{network:"twitter"}})],1)}),[function(){var t=this._self._c;return t("strong",[this._v("Share this"),t("br")])}],!1,null,null,null).exports),h={name:"Layout",components:{Home:s.a,Footer:i.a,Header:n.a,SocialShare:c},data:()=>({}),methods:{formatDate:t=>t.substring(0,10)},mounted(){var t=location.host.replace("www.","");t=new RegExp(t,"i");for(var e=document.getElementsByTagName("a"),a=0;a<e.length;a++){var s=e[a].host;t.test(s)||(e[a].setAttribute("target","_blank"),e[a].setAttribute("rel","noopener noreferrer"))}}},m=(a(277),Object(o.a)(h,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"theme-container"},[e("Header"),t.$page.frontmatter.home?e("Home"):e("div",{staticClass:"layout"},["post"==t.$page.frontmatter.type?e("header",{staticClass:"container container--content post-header"},[e("h1",[t._v(t._s(t.$frontmatter.title))]),t.$frontmatter.updatedDate?e("div",{staticClass:"post-date"},[t._v(t._s(t.formatDate(t.$frontmatter.date))),e("br"),t._v("Updated: "+t._s(t.formatDate(t.$frontmatter.updatedDate)))]):e("div",{staticClass:"post-date"},[t._v(t._s(t.formatDate(t.$frontmatter.date)))]),t.$frontmatter.image?e("div",{staticClass:"post-media"},[e("img",{attrs:{src:"/images/articles/"+t.$frontmatter.image,alt:"$frontmatter.imageAlt",loading:"lazy"}})]):t._e()]):t._e(),"post"==t.$page.frontmatter.type?e("Content",{staticClass:"container container--content rte"}):e("Content",{staticClass:"container"})],1),"post"==t.$page.frontmatter.type?e("SocialShare"):t._e(),e("Footer")],1)}),[],!1,null,null,null));e.default=m.exports}}]);