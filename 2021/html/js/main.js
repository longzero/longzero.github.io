DEBUG = true
if (DEBUG) console.warn("DEBUG is on.")

let isArticle = false


const photosContainer = document.querySelector('[data-photos]')
if (photosContainer) {
  let photos
  let photoUrl
  let thumbnailUrl
  fetch("/data/photos.json")
  .then(response => response.json())
  .then(data => {
    photos = data
    let query = photosContainer.dataset.photos
    let string = "html/photos/" + query
    let start = string.length
    for (let i=0; i<photos.length; i=i+1) {
      if (photos[i].match(query) && !photos[i].match("thumbnails")) {
        photoUrl = photos[i].substring(4, photos[i].length)
        thumbnailUrl = "/photos/" + query + "/thumbnails/" + photos[i].substring(start, photos[i].length)
        string = '<a class="thumbnail-link" href="#'+photoUrl+'" data-photo="'+photoUrl+'" name="'+photoUrl+'">'
          +'<img class="thumbnail-image" src="'+thumbnailUrl+'" alt="" loading="lazy">'
          +'</a>'
        photosContainer.innerHTML += string
      }
    }

    const photo = document.querySelectorAll('[data-photo')
    for (let i=0; i<photo.length; i=i+1) {
      photo[i].addEventListener('click',function(){
        let image = document.querySelector('.js-site-media img')
        image.src = this.dataset.photo
      })
    }
  });
}



const articlesContainer = document.querySelector('[data-articles]')
const articleWrapper = document.querySelector('[data-article]')
if (articlesContainer && articleWrapper) {
  const imagePath = '/images/articles/'
  let photoUrl
  let thumbnailUrl
  fetch("/data/articles.json")
  .then(response => response.json())
  .then(data => {
    let articles = data

    for (const key in articles) {
      if (articles.hasOwnProperty(key)) {
        // DEBUG && console.log(articles[key].title)
        // DEBUG && console.log(articles[key].slug)

        if (articles[key].status == 1) {
          // let link = '/#/articles/' + articles[key].slug
          let link = '/#/articles/' + key // Use the file name as the slug

          let postItem = document.createElement('div')
          postItem.classList.add('post-item','fade-in','move-up','animation','js-animate')
          let articleLink = document.createElement('a')
          articleLink.classList.add('post-link')
          articleLink.href = link
          articleLink.setAttribute('data-article-link', link)
          postItem.appendChild(articleLink);
          articlesContainer.appendChild(postItem);

          let postImage = document.createElement('div')
          postImage.classList.add('post-image')
          let postPictureElement = document.createElement('picture')
          let postPictureSourceElement = document.createElement('source')
          postPictureSourceElement.setAttribute('srcset', imagePath + articles[key].image)
          let postPictureImgElement = document.createElement('img')
          postPictureImgElement.setAttribute('loading', 'lazy')
          postPictureImgElement.setAttribute('src', imagePath + articles[key].image)
          postPictureElement.appendChild(postPictureSourceElement);
          postPictureElement.appendChild(postPictureImgElement);
          postImage.appendChild(postPictureElement);
          articleLink.appendChild(postImage)

          let postData = document.createElement('div')
          postData.classList.add('post-data')
          let postTitle = document.createElement('div')
          postTitle.classList.add('post-title')
          postTitle.innerHTML = articles[key].title
          let postDate = document.createElement('div')
          postDate.classList.add('post-date')
          postDate.innerHTML = articles[key].date
          postData.appendChild(postTitle)
          postData.appendChild(postDate)
          articleLink.appendChild(postData)
        }
      }
    }


    let articleBodyClass = 'article-body'
    let articleTitleClass = 'article-title'

    function correctImagePaths(articleBodyContent) {
      let string = '<img src="'
      let path = string + window.location.origin + imagePath
      return articleBodyContent.replace(/<img src="/g, path);
    }

    function displayArticle(slug) {
      // DEBUG && console.log(slug)

      articleWrapper.innerHTML = "" // Reset article

      if (slug != "") {
        isArticle = true
        document.body.classList.add('show-article')
        let key = slug.split("/");
        key = key[key.length - 1]

        // DEBUG && console.warn(key)
        // DEBUG && console.log(articles)
        // DEBUG && console.log(articles[key].title)
        // DEBUG && console.log(articles[key].body)
        // DEBUG && console.warn(typeof articles[key].body)

        let articleImage = document.createElement('img')
        articleImage.classList.add('article-image')
        articleImage.src = imagePath + articles[key].image

        let articleImageWrapper = document.createElement('div')
        articleImageWrapper.classList.add('article-main-media')

        checkImage(articleImage.src,
          function(){
            articleImageWrapper.appendChild(articleImage)
          },
          function(){
            DEBUG && console.warn("No main image for this article.")
          }
        );


        let articleTitle = document.createElement('h1')
        articleTitle.classList.add(articleTitleClass)
        articleTitle.innerHTML = articles[key].title

        let articleBody = document.createElement('div')
        articleBody.classList.add(articleBodyClass)
        articleBody.innerHTML = correctImagePaths(articles[key].body)

        articleWrapper.appendChild(articleImageWrapper)
        articleWrapper.appendChild(articleTitle)
        articleWrapper.appendChild(articleBody)
      }
      else {
        isArticle = false
        document.body.classList.remove('show-article')
      }
    }

    function checkImage(imageSrc, good, bad) {
      var img = new Image();
      img.onload = good;
      img.onerror = bad;
      img.src = imageSrc;
    }


    // When page loads, if there is a hash, do stuff
    if (window.location.hash) {
      // DEBUG && console.warn("Hash exists: " + window.location.hash)
      displayArticle(window.location.hash)
    }
    else {
      isArticle = false
    }


    // When hash changes, do stuff
    window.addEventListener('hashchange', function(){
      // DEBUG && console.warn("URL has changed: " + window.location.hash)
      displayArticle(window.location.hash)
    })

  })
}



//- FOR DEVELOPMENT ONLY
if (window.location.href.indexOf('.local') > -1) {
  console.log("readyState: " + document.readyState)
  console.warn('Website is running locally')
  let script = document.createElement('script');
  script.src = '/js/live.js';
  document.write(script.outerHTML);
}
