# Progressive Web Apps @cmda-minor-web · 20-21

### View the app
:earth_americas:  [live website](https://progressive-movieapp.herokuapp.com/)


## Description
Do you also spend too much time looking for a decent movie to watch?  
With this progressive web application you can see right away what the top movies are at this very moment! 
Find a movie to your liking, and make some popcorn instead of spending minutes to find a good title.  
  
![screenshotFront](https://user-images.githubusercontent.com/55492381/110913908-fef5b700-8315-11eb-8b31-0c65f7b02cc5.png)  


## Table of Contents  
[View the app](https://github.com/NathanNeelis/progressive-web-apps-2021#view-the-app)  
[Description](https://github.com/NathanNeelis/progressive-web-apps-2021#description)  
[Getting started](https://github.com/NathanNeelis/progressive-web-apps-2021#getting-started)  
[Packages](https://github.com/NathanNeelis/progressive-web-apps-2021#packages)  
[Features](https://github.com/NathanNeelis/progressive-web-apps-2021#features)  
> [Build scripts](https://github.com/NathanNeelis/progressive-web-apps-2021#build-scripts)  
> [Service worker](https://github.com/NathanNeelis/progressive-web-apps-2021#service-worker)  
> [Compression](https://github.com/NathanNeelis/progressive-web-apps-2021#compression)  
> [Minify](https://github.com/NathanNeelis/progressive-web-apps-2021#minify)  
> [Critical CSS](https://github.com/NathanNeelis/progressive-web-apps-2021#critical-css)  

[API](https://github.com/NathanNeelis/progressive-web-apps-2021#the-api)  
[Project status](https://github.com/NathanNeelis/progressive-web-apps-2021#project-status)  
[License](https://github.com/NathanNeelis/progressive-web-apps-2021#license)  
[Resources](https://github.com/NathanNeelis/progressive-web-apps-2021#resources)  



## Getting started

### Cloning the repo
1. Create your git repo  
    ```bash
    mkdir foldername  
    cd "/foldername"  
    git init  
    ```  

2. Clone this repo  
    ```bash
    git clone https://github.com/NathanNeelis/progressive-web-apps-2021.git
    ```   

3. install packages  
    ```bash
    npm install
    ```  

## Packages
* Body-parser
* Express
* ejs
* Node-fetch
* NPM run all
* Gulp
* Gulp autoprefixer
* Gulp clean css
* Gulp concat
* Gulp minify
* Compression


## Features
### Build scripts
This course I was introduced to building scripts. 
With these building scripts I can concatonate and minify my css and js files and write them in a other folder.
Everytime I start my app, the build scripts will run on pre start. This means that before the apps starts up, it will build new javascript and css files from my original files. I used the NPM package `gulp` for this. Below here is an example of how I concatonate and minify my javascript files.  
  
```javascript
const gulp = require('gulp')
const concat = require('gulp-concat');
const minify = require('gulp-minify');

return gulp.src([
        './src/js/homeSearch.js',
        './src/js/movieSearch.js',
    ])
    .pipe(minify({
        noSource: true,
        ext: {
            min: '.js'
        }
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./static/js'))
```

### Service-worker
I installed a service worker that caches an offline page.  
Once you have been on my web application, and your internet connection fails you will now see an offline page instead of the usual no internet page.  

```javascript
const CORE_ASSETS = [
    '/offline',
    '/css/critical.css',
    '/css/style.css',
    '/connection-error.svg',
    '/js/index.js',
];

self.addEventListener('install', (event) => {
    console.log('install the service worker');

    // pre saves the core assets in the cache
    event.waitUntil(
        caches.open(CORE_CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS)
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('fetch', (event) => {
    ...
    // open cache and fetch or save render pages. If not able to: render offline page
        event.respondWith(
            caches.open('html-cache')
            .then(cache => cache.match(event.request))
            .then(response => response ? response : fetchAndCache(event.request, 'html-cache'))
            .catch(() => {
                return caches.open(CORE_CACHE_NAME)
                    .then(cache => cache.match('/offline'))
            })
        )
```
  
![Schermafbeelding 2021-03-22 om 15 24 15](https://user-images.githubusercontent.com/55492381/112005043-acd94080-8b22-11eb-8bcd-b37e117c0101.png)
  
#### Caches and faster loading
My service worker also caches all the pages you visit.  
I fully realise this might not be the best strategy if you have a very large application, but for a small one like mine, this is in my opinion acceptable.
The next time you visit a page that you've already visited, it renders it from the cache.  
This has advantages and disadvantages.   
The advantages are: faster loading (like alot) and you can also visit the pages when your internet connection fails.  
The disadvantage is that you render out of date content from the cache.  
  
For this disadvantage I save the last updated content again to the cache while its rendering. This means, the next time you visit that page you will get the updated content.
Not an ideal solution, but perhaps acceptable for pages that almost never changes its content.
```javascript
        event.respondWith(
            caches.open('html-cache')
            .then(cache => cache.match(event.request))
            .then(response => response ? response : fetchAndCache(event.request, 'html-cache'))
            .catch(() => {
                return caches.open(CORE_CACHE_NAME)
                    .then(cache => cache.match('/offline'))
            })
        )

        event.waitUntil(
            fetchAndCache(event.request, 'html-cache')
        )

```

#### Render from web but cache it all the same
I have the /movie page that shows the most popular movies at that time.  
This isnt a page that you want to have outdated. So I wrote some exceptional rules for this page.  
If you have internet, render this page from the internet and save it in the cache.  
If you don't have internet, render this page from the cache. This is always better then no page at all, although it might be outdated.  
```javascript

    // MOVIE PAGE SPECIFIC
    else if (htmlGetRequest(event.request) && event.request.url.match('/movies')) {
        event.respondWith(
            fetchAndCache(event.request, 'html-cache')
            .catch(() => {
                return caches.open('html-cache')
                    .then(cache => cache.match('/movies'))
            })
        )
    }
```


#### Update caches
In the core assets are also the css files and client-side javascript files. 
If you update one of those, it should also be updated in the caches, otherwise you might get errors. 
To do this, I build a version checker in. Although it is not best practice how I've done this. 
At the moment I do this manually in the service worker and increment the version manually. 
You can do this automatically if you update your files, but that requires more study of my part. 
In the activation of the service worker I do however check for the version of the cache. 
If the cache is outdated, it removes the old cache, so the user isn't stacking old caches. 
```javascript
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Service workers works direct instead after a reload in multiple browser tabs

    // removes old cache if version is updated
    event.waitUntil(
        caches.keys() 
        .then((keylist) => {
            return Promise.all([
                keylist
                .filter(cacheKey => cacheKey.includes('fam-cache') && cacheKey !== CORE_CACHE_NAME) // array of strings with caches that include fam-cache but are not the current version
                .forEach(outdatedCache => caches.delete(outdatedCache))
            ])
        })
    )
});
```
Also in this code example I use `clients.claim()`. This activates the service-worker through multiple tabs. Meaning if you have multiple tabs open with this app, it corresponds with eachother.





### Compression
To make this app even faster I compress my files by using Gzip compression.  
This might be overrated in this small app, but I wanted to see what it does and how it works. So to test compression in my app I created a testing page with a string of text that I repeat 10.000 times.   
```javascript
    .get('/testcomp', (req, res) => {
        const payload = "this is a testing string if the app gets faster..."
        res.send(payload.repeat(10000))
    }) // Testing compression
```
This resulted in a page of 500kb. This is enough of a size that you can see big results when you start compressing.   

<img src="https://user-images.githubusercontent.com/55492381/111985404-dd15e480-8b0c-11eb-9e74-256cd722c8d9.png" width="500" />  
  
It turns out, using Gzip as a compression is fairly easy. Just install the package and use it. There are some options you can use though. I used a threshold option here and gave it a value of 0. This means that it compresses all the files that are bigger then 0 bytes. You could if you want set it to 1kb if you want to skip the comporession of very small files. I also use a filter funciton `shouldCompress` that checks if the request headers are set to `x-no-compression` if so, it doenst compress those files.  

```javascript
    .use(compression({
        threshold: 0, // compress everyfile that is more then 0 bytes
        filter: shouldCompress, // dont compress if header is x-no-compression
    }))

    function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
    }
```
After the commpression the file went from 500kb to only 180bytes. Thats an enourmes gain!  
<img src="https://user-images.githubusercontent.com/55492381/111987065-03d51a80-8b0f-11eb-826f-c11408c934a8.png" width="500" />  

### Minify
Every character costs bytes in your file. And you want every file to be as less bytes as it can be. Less bytes is faster loading, thats also why we compress the files as described above. Another step to lessen the amount of bytes is minifying your files. This means that you re-write the code with short names and less space. To rewrite these code files you can use packages like gulp-clean-css and gulp-minify. There are more, but in this project I am already using gulp to concatenate files. In the code example below I concat my css and minify it by using gulp.

```javascript
return gulp.src([
        './src/css/main.css',
        './src/css/nav.css',
        './src/css/forms.css',
        './src/css/detailpage.css',
        './src/css/intro.css',
        './src/css/movieDisplay.css',
        './src/css/scrollbar.css',
        './src/css/search.css',
        './src/css/topmovies.css',
        './src/css/recentlyViewed.css',
    ])
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest('./static/css'))
```
For the javascript part I used gulp-minify which reduces the size of all my javascript code.


### Critical CSS
Performance is all about perceived performance. And part of that is how to get most of the website as quickly to the user. Critical CSS is a big part of that for bigger websites or apps but I researched this topic nontheless for my simple app.   
  
Critical CSS is a file with the most important css for the page. So which styling do I need to give the user all the styling he needs to view the page. This means you start looking at the styling for the first viewport, above the fold they call it. Everything below can wait a second longer to load because its not visible on the screen anyway. So gathering the styling only needed for that specific page and only for the items above the fold. Put all these styles in a critical css style sheet and load it first.

```html
    <%- include('criticalCss.ejs'); %>

    <link rel="preload" href="css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="css/style.css">
    </noscript>
    
```
In the code example above you see that the critical CSS is included by a other ejs file. In this file all the critical CSS is embedded in a `<style> tag`. The main style.css file loaded async so it is not render blocking. The `link rel="preload"` and `as="style` requests the stylesheet asynchronously. The `unload` attribute in the link allows the CSS to be processed when it finishes loading. "nulling" the `onload` handler once it is used helps some browsers avoid re-calling the handler upon switching the rel attribute. So it says in my [resourse about applying critical CSS](https://web.dev/defer-non-critical-css/).  
  
In the screenshot below you can see the difference between the stylesheets coverage. About 72% of the normal stylesheet is not needed in this specific page at all, while there is no unused css code for the critical css stylesheet.  

![Schermafbeelding 2021-03-22 om 14 24 21](https://user-images.githubusercontent.com/55492381/111996432-4ea85f80-8b1a-11eb-986c-ce371f715eb7.png)

## The API
This API contains information about movies and tv-shows.   
You can search for movies or shows or filter on genre / collections and so on. For example, you can show the top movies at this moment.  

According to the documentation there is no rate limite for this API since decembe 2019.  

To find out more what this API can do, please read more on [ThemovieDB API documentation](https://developers.themoviedb.org/3/getting-started/introduction)  

### API data
<details>
  <summary>Example single data file</summary>
  
 ```json
{
    "adult": false,
    "backdrop_path": null,
    "belongs_to_collection": null,
    "budget": 0,
    "genres": [],
    "homepage": null,
    "id": 319964,
    "imdb_id": "tt3638686",
    "original_language": "en",
    "original_title": "Famous Nathan",
    "overview": "A Coney Island-inspired, densely-layered visually dynamic documentary portrait of the life and times of the original Nathan's Famous, created in 1916 by filmmaker Lloyd Handwerker's grandparents, Nathan and Ida Handwerker. 30 years in the making, Famous Nathan interweaves decades-spanning archival footage, family photos and home movies, an eclectic soundtrack and never-before-heard audio from Nathan: his only interview, ever as well as compelling, intimate and hilarious interviews with the dedicated band of workers, not at all shy at offering opinions, memories and the occasional tall tale.",
    "popularity": 7.938,
    "poster_path": "/9MI47S5IX3YqNVK05yaYSNU4EEa.jpg",
    "production_companies": [],
    "production_countries": [{
        "iso_3166_1": "US",
        "name": "United States of America"
    }],
    "release_date": "2015-07-17",
    "revenue": 0,
    "runtime": 86,
    "spoken_languages": [{
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
    }],
    "status": "Released",
    "tagline": "",
    "title": "Famous Nathan",
    "video": false,
    "vote_average": 5.8,
    "vote_count": 4
}
 ```
</details>

<details>
  <summary>Example single data file - transformed</summary>
  
 ```javascript
{
    id: 319964,
    overview: "A Coney Island-inspired, densely-layered visually dynamic documentary portrait of the life and times of the original Nathan's Famous, created in 1916 by filmmaker Lloyd Handwerker's grandparents, Nathan and Ida Handwerker. 30 years in the making, Famous Nathan interweaves decades-spanning archival footage, family photos and home movies, an eclectic soundtrack and never-before-heard audio from Nathan: his only interview, ever as well as compelling, intimate and hilarious interviews with the dedicated band of workers, not at all shy at offering opinions, memories and the occasional tall tale.",
    popularity: 7.938,
    poster_path: "/9MI47S5IX3YqNVK05yaYSNU4EEa.jpg",
    release_date: "2015-07-17",
    title: "Famous Nathan",
    vote_average: 5.8,
    vote_count: 4
}
 ```
</details>

<details>
  <summary>Example multiple data file</summary>
  
 ```json
{
    "page": 1,
    "results": [{
        "adult": false,
        "backdrop_path": "/srYya1ZlI97Au4jUYAktDe3avyA.jpg",
        "genre_ids": [14, 28, 12],
        "id": 464052,
        "original_language": "en",
        "original_title": "Wonder Woman 1984",
        "overview": "Wonder Woman comes into conflict with the Soviet Union during the Cold War in the 1980s and finds a formidable foe by the name of the Cheetah.",
        "popularity": 2247.44,
        "poster_path": "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
        "release_date": "2020-12-16",
        "title": "Wonder Woman 1984",
        "video": false,
        "vote_average": 7,
        "vote_count": 3619
    }, {
        "adult": false,
        "backdrop_path": "/6TPZSJ06OEXeelx1U1VIAt0j9Ry.jpg",
        "genre_ids": [28, 80, 53],
        "id": 587996,
        "original_language": "es",
        "original_title": "Bajocero",
        "overview": "When a prisoner transfer van is attacked, the cop in charge must fight those inside and outside while dealing with a silent foe: the icy temperatures.",
        "popularity": 1835.427,
        "poster_path": "/dWSnsAGTfc8U27bWsy2RfwZs0Bs.jpg",
        "release_date": "2021-01-29",
        "title": "Below Zero",
        "video": false,
        "vote_average": 6.4,
        "vote_count": 303
    }, {
        "adult": false,
        "backdrop_path": "/lOSdUkGQmbAl5JQ3QoHqBZUbZhC.jpg",
        "genre_ids": [53, 28, 878],
        "id": 775996,
        "original_language": "en",
        "original_title": "Outside the Wire",
        "overview": "In the near future, a drone pilot is sent into a deadly militarized zone and must work with an android officer to locate a doomsday device.",
        "popularity": 1484.753,
        "poster_path": "/6XYLiMxHAaCsoyrVo38LBWMw2p8.jpg",
        "release_date": "2021-01-15",
        "title": "Outside the Wire",
        "video": false,
        "vote_average": 6.5,
        "vote_count": 688
    }, {
        "adult": false,
        "backdrop_path": "/fRrpOILyXuWaWLmqF7kXeMVwITQ.jpg",
        "genre_ids": [27, 53, 12],
        "id": 522444,
        "original_language": "en",
        "original_title": "Black Water: Abyss",
        "overview": "An adventure-loving couple convince their friends to explore a remote, uncharted cave system in the forests of Northern Australia. With a tropical storm approaching, they abseil into the mouth of the cave, but when the caves start to flood, tensions rise as oxygen levels fall and the friends find themselves trapped. Unknown to them, the storm has also brought in a pack of dangerous and hungry crocodiles.",
        "popularity": 1335.022,
        "poster_path": "/95S6PinQIvVe4uJAd82a2iGZ0rA.jpg",
        "release_date": "2020-07-09",
        "title": "Black Water: Abyss",
        "video": false,
        "vote_average": 5.1,
        "vote_count": 125
    }, {
        "adult": false,
        "backdrop_path": "/vfuzELmhBjBTswXj2Vqxnu5ge4g.jpg",
        "genre_ids": [53, 80],
        "id": 602269,
        "original_language": "en",
        "original_title": "The Little Things",
        "overview": "Deputy Sheriff Joe \"Deke\" Deacon joins forces with Sgt. Jim Baxter to search for a serial killer who's terrorizing Los Angeles. As they track the culprit, Baxter is unaware that the investigation is dredging up echoes of Deke's past, uncovering disturbing secrets that could threaten more than his case.",
        "popularity": 1669.19,
        "poster_path": "/c7VlGCCgM9GZivKSzBgzuOVxQn7.jpg",
        "release_date": "2021-01-27",
        "title": "The Little Things",
        "video": false,
        "vote_average": 6.3,
        "vote_count": 304
    }, {
        "adult": false,
        "backdrop_path": "/nz8xWrTKZzA5A7FgxaM4kfAoO1W.jpg",
        "genre_ids": [878, 28],
        "id": 651571,
        "original_language": "en",
        "original_title": "Breach",
        "overview": "A hardened mechanic must stay awake and maintain an interstellar ark fleeing the dying planet Earth with a few thousand lucky souls on board... the last of humanity. Unfortunately, humans are not the only passengers. A shapeshifting alien creature has taken residence, its only goal is to kill as many people as possible. The crew must think quickly to stop this menace before it destroys mankind.",
        "popularity": 1215.687,
        "poster_path": "/13B6onhL6FzSN2KaNeQeMML05pS.jpg",
        "release_date": "2020-12-17",
        "title": "Breach",
        "video": false,
        "vote_average": 4.6,
        "vote_count": 248
    }, {
        "adult": false,
        "backdrop_path": "/3ombg55JQiIpoPnXYb2oYdr6DtP.jpg",
        "genre_ids": [878, 28],
        "id": 560144,
        "original_language": "en",
        "original_title": "Skylines",
        "overview": "When a virus threatens to turn the now earth-dwelling friendly alien hybrids against humans, Captain Rose Corley must lead a team of elite mercenaries on a mission to the alien world in order to save what's left of humanity.",
        "popularity": 1126.951,
        "poster_path": "/2W4ZvACURDyhiNnSIaFPHfNbny3.jpg",
        "release_date": "2020-10-25",
        "title": "Skylines",
        "video": false,
        "vote_average": 5.7,
        "vote_count": 167
    }, {
        "adult": false,
        "backdrop_path": "/fX8e94MEWSuTJExndVYxKsmA4Hw.jpg",
        "genre_ids": [28, 12, 80],
        "id": 604822,
        "original_language": "zh",
        "original_title": "急先锋",
        "overview": "Covert security company Vanguard is the last hope of survival for an accountant after he is targeted by the world's deadliest mercenary organization.",
        "popularity": 1135.61,
        "poster_path": "/vYvppZMvXYheYTWVd8Rnn9nsmNp.jpg",
        "release_date": "2020-09-30",
        "title": "Vanguard",
        "video": false,
        "vote_average": 6.5,
        "vote_count": 191
    }, {
        "adult": false,
        "backdrop_path": "/kf456ZqeC45XTvo6W9pW5clYKfQ.jpg",
        "genre_ids": [10751, 16, 35, 18, 10402, 14],
        "id": 508442,
        "original_language": "en",
        "original_title": "Soul",
        "overview": "Joe Gardner is a middle school teacher with a love for jazz music. After a successful gig at the Half Note Club, he suddenly gets into an accident that separates his soul from his body and is transported to the You Seminar, a center in which souls develop and gain passions before being transported to a newborn child. Joe must enlist help from the other souls-in-training, like 22, a soul who has spent eons in the You Seminar, in order to get back to Earth.",
        "popularity": 1106.235,
        "poster_path": "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
        "release_date": "2020-12-25",
        "title": "Soul",
        "video": false,
        "vote_average": 8.3,
        "vote_count": 4772
    }, {
        "adult": false,
        "backdrop_path": "/yImmxRokQ48PD49ughXdpKTAsAU.jpg",
        "genre_ids": [28, 12, 35, 10751],
        "id": 644092,
        "original_language": "en",
        "original_title": "Finding 'Ohana",
        "overview": "Two Brooklyn siblings' summer in a rural Oahu town takes an exciting turn when a journal pointing to long-lost treasure sets them on an adventure, leading them to reconnect with their Hawaiian heritage.",
        "popularity": 964.264,
        "poster_path": "/tTWl37oAYRXS3D5mEHmjveXXyrN.jpg",
        "release_date": "2021-01-29",
        "title": "Finding 'Ohana",
        "video": false,
        "vote_average": 6.9,
        "vote_count": 113
    }, {
        "adult": false,
        "backdrop_path": "/wzJRB4MKi3yK138bJyuL9nx47y6.jpg",
        "genre_ids": [28, 53, 878],
        "id": 577922,
        "original_language": "en",
        "original_title": "Tenet",
        "overview": "Armed with only one word - Tenet - and fighting for the survival of the entire world, the Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
        "popularity": 953.705,
        "poster_path": "/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
        "release_date": "2020-08-22",
        "title": "Tenet",
        "video": false,
        "vote_average": 7.3,
        "vote_count": 4377
    }, {
        "adult": false,
        "backdrop_path": "/drulhSX7P5TQlEMQZ3JoXKSDEfz.jpg",
        "genre_ids": [18, 14, 878],
        "id": 581389,
        "original_language": "ko",
        "original_title": "승리호",
        "overview": "When the crew of a space junk collector ship called The Victory discovers a humanoid robot named Dorothy that's known to be a weapon of mass destruction, they get involved in a risky business deal which puts their lives at stake.",
        "popularity": 1535.219,
        "poster_path": "/y2Yp7KC2FJSsdlRM5qkkIwQGCqU.jpg",
        "release_date": "2021-02-05",
        "title": "Space Sweepers",
        "video": false,
        "vote_average": 7.3,
        "vote_count": 187
    }, {
        "adult": false,
        "backdrop_path": "/h9DIlghaiTxbQbt1FIwKNbQvEL.jpg",
        "genre_ids": [28, 12, 53],
        "id": 581387,
        "original_language": "ko",
        "original_title": "백두산",
        "overview": "Stagnant since 1903, at an elevation of 9000', a volcano erupts on the mythical and majestic Baekdu Mountain.",
        "popularity": 936.329,
        "poster_path": "/zoeKREZ2IdAUnXISYCS0E6H5BVh.jpg",
        "release_date": "2019-12-19",
        "title": "Ashfall",
        "video": false,
        "vote_average": 6.7,
        "vote_count": 189
    }, {
        "adult": false,
        "backdrop_path": "/54yOImQgj8i85u9hxxnaIQBRUuo.jpg",
        "genre_ids": [28, 80, 18, 53],
        "id": 539885,
        "original_language": "en",
        "original_title": "Ava",
        "overview": "A black ops assassin is forced to fight for her own survival after a job goes dangerously wrong.",
        "popularity": 829.853,
        "poster_path": "/qzA87Wf4jo1h8JMk9GilyIYvwsA.jpg",
        "release_date": "2020-07-02",
        "title": "Ava",
        "video": false,
        "vote_average": 5.6,
        "vote_count": 1261
    }, {
        "adult": false,
        "backdrop_path": "/2M2JxEv3HSpjnZWjY9NOdGgfUd.jpg",
        "genre_ids": [53, 28, 80, 18],
        "id": 553604,
        "original_language": "en",
        "original_title": "Honest Thief",
        "overview": "A bank robber tries to turn himself in because he's falling in love and wants to live an honest life...but when he realizes the Feds are more corrupt than him, he must fight back to clear his name.",
        "popularity": 814.934,
        "poster_path": "/zeD4PabP6099gpE0STWJrJrCBCs.jpg",
        "release_date": "2020-09-03",
        "title": "Honest Thief",
        "video": false,
        "vote_average": 6.6,
        "vote_count": 598
    }, {
        "adult": false,
        "backdrop_path": "/7TxeZVg2evMG42p0uSbMJpWNQ8A.jpg",
        "genre_ids": [10751, 16, 14],
        "id": 520946,
        "original_language": "en",
        "original_title": "100% Wolf",
        "overview": "Freddy Lupin, heir to a proud family line of werewolves, is in for a shock when on his 14th birthday his first 'warfing' goes awry, turning him into a ferocious poodle. The pack elders give Freddy until the next moonrise to prove he has the heart of a wolf, or risk being cast out forever. With the help of an unlikely ally in a streetwise stray named Batty, Freddy must prove he's 100% Wolf.",
        "popularity": 752.919,
        "poster_path": "/2VrvxK4yxNCU6KVgo5TADJeBEQu.jpg",
        "release_date": "2020-06-26",
        "title": "100% Wolf",
        "video": false,
        "vote_average": 5.9,
        "vote_count": 76
    }, {
        "adult": false,
        "backdrop_path": "/cjaOSjsjV6cl3uXdJqimktT880L.jpg",
        "genre_ids": [10751, 12, 14, 16],
        "id": 529203,
        "original_language": "en",
        "original_title": "The Croods: A New Age",
        "overview": "Searching for a safer habitat, the prehistoric Crood family discovers an idyllic, walled-in paradise that meets all of its needs. Unfortunately, they must also learn to live with the Bettermans -- a family that's a couple of steps above the Croods on the evolutionary ladder. As tensions between the new neighbors start to rise, a new threat soon propels both clans on an epic adventure that forces them to embrace their differences, draw strength from one another, and survive together.",
        "popularity": 707.737,
        "poster_path": "/tK1zy5BsCt1J4OzoDicXmr0UTFH.jpg",
        "release_date": "2020-11-25",
        "title": "The Croods: A New Age",
        "video": false,
        "vote_average": 7.6,
        "vote_count": 1484
    }, {
        "adult": false,
        "backdrop_path": "/9pHxv7TX0jOKNgnGMDP6RJ2m1GL.jpg",
        "genre_ids": [28, 53],
        "id": 737568,
        "original_language": "en",
        "original_title": "The Doorman",
        "overview": "A former Marine turned doorman at a luxury New York City high-rise must outsmart and battle a group of art thieves and their ruthless leader — while struggling to protect her sister's family. As the thieves become increasingly desperate and violent, the doorman calls upon her deadly fighting skills to end the showdown.",
        "popularity": 709.055,
        "poster_path": "/pklyUbh4k1DbHdnsOMASyw7C6NH.jpg",
        "release_date": "2020-10-01",
        "title": "The Doorman",
        "video": false,
        "vote_average": 5.8,
        "vote_count": 158
    }, {
        "adult": false,
        "backdrop_path": "/2Fk3AB8E9dYIBc2ywJkxk8BTyhc.jpg",
        "genre_ids": [28, 53],
        "id": 524047,
        "original_language": "en",
        "original_title": "Greenland",
        "overview": "John Garrity, his estranged wife and their young son embark on a perilous journey to find sanctuary as a planet-killing comet hurtles toward Earth. Amid terrifying accounts of cities getting levelled, the Garrity's experience the best and worst in humanity. As the countdown to the global apocalypse approaches zero, their incredible trek culminates in a desperate and last-minute flight to a possible safe haven.",
        "popularity": 684.669,
        "poster_path": "/bNo2mcvSwIvnx8K6y1euAc1TLVq.jpg",
        "release_date": "2020-07-29",
        "title": "Greenland",
        "video": false,
        "vote_average": 7.2,
        "vote_count": 1892
    }, {
        "adult": false,
        "backdrop_path": "/5TbtcmRySXPAEXBzwhiOYYDQmgv.jpg",
        "genre_ids": [27, 9648],
        "id": 723072,
        "original_language": "en",
        "original_title": "Host",
        "overview": "Six friends hire a medium to hold a séance via Zoom during lockdown — but they get far more than they bargained for as things quickly go wrong. When an evil spirit starts invading their homes, they begin to realize they might not survive the night.",
        "popularity": 611.35,
        "poster_path": "/h7dZpJDORYs5c56dydbrLFkEXpE.jpg",
        "release_date": "2020-12-04",
        "title": "Host",
        "video": false,
        "vote_average": 7,
        "vote_count": 123
    }],
    "total_pages": 500,
    "total_results": 10000
}
 ```
</details>

<details>
  <summary>Example multiple data file - transformed</summary>
  
 ```javascript
{
0: {
    id: 464052,
    overview: "Wonder Woman comes into conflict with the Soviet Union during the Cold War in the 1980s and finds a formidable foe by the name of the Cheetah.",
    popularity: 2247.44,
    poster_path: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
    release_date: "2020-12-16",
    title: "Wonder Woman 1984",
    vote_average: 7,
    vote_count: 3619,
}
1: {
    id: 587996,
    title: "Below Zero",
    overview: "When a prisoner transfer van is attacked, the cop … dealing with a silent foe: the icy temperatures.",
    popularity: 1835.427,
    poster_path: "/dWSnsAGTfc8U27bWsy2RfwZs0Bs.jpg",
    …
}
2: {
    id: 775996,
    title: "Outside the Wire",
    overview: "In the near future, a drone pilot is sent into a d…h an android officer to locate a doomsday device.",
    popularity: 1484.753,
    poster_path: "/6XYLiMxHAaCsoyrVo38LBWMw2p8.jpg",
    …
}
3: {
    id: 522444,
    title: "Black Water: Abyss",
    overview: "An adventure-loving couple convince their friends …ght in a pack of dangerous and hungry crocodiles.",
    popularity: 1335.022,
    poster_path: "/95S6PinQIvVe4uJAd82a2iGZ0rA.jpg",
    …
}
4: {
    id: 602269,
    title: "The Little Things",
    overview: "Deputy Sheriff Joe "
    Deke " Deacon joins forces with…g secrets that could threaten more than his case.",
    popularity: 1669.19,
    poster_path: "/c7VlGCCgM9GZivKSzBgzuOVxQn7.jpg",
    …
}
5: {
    id: 651571,
    title: "Breach",
    overview: "A hardened mechanic must stay awake and maintain a…y to stop this menace before it destroys mankind.",
    popularity: 1215.687,
    poster_path: "/13B6onhL6FzSN2KaNeQeMML05pS.jpg",
    …
}
6: {
    id: 560144,
    title: "Skylines",
    overview: "When a virus threatens to turn the now earth-dwell…n world in order to save what's left of humanity.",
    popularity: 1126.951,
    poster_path: "/2W4ZvACURDyhiNnSIaFPHfNbny3.jpg",
    …
}
7: {
    id: 604822,
    title: "Vanguard",
    overview: "Covert security company Vanguard is the last hope … by the world's deadliest mercenary organization.",
    popularity: 1135.61,
    poster_path: "/vYvppZMvXYheYTWVd8Rnn9nsmNp.jpg",
    …
}
8: {
    id: 508442,
    title: "Soul",
    overview: "Joe Gardner is a middle school teacher with a love…n the You Seminar, in order to get back to Earth.",
    popularity: 1106.235,
    poster_path: "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
    …
}
9: {
    id: 644092,
    title: "Finding 'Ohana",
    overview: "Two Brooklyn siblings' summer in a rural Oahu town…g them to reconnect with their Hawaiian heritage.",
    popularity: 964.264,
    poster_path: "/tTWl37oAYRXS3D5mEHmjveXXyrN.jpg",
    …
}
10: {
    id: 577922,
    title: "Tenet",
    overview: "Armed with only one word - Tenet - and fighting fo…n that will unfold in something beyond real time.",
    popularity: 953.705,
    poster_path: "/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
    …
}
11: {
    id: 581389,
    title: "Space Sweepers",
    overview: "When the crew of a space junk collector ship calle…ky business deal which puts their lives at stake.",
    popularity: 1535.219,
    poster_path: "/y2Yp7KC2FJSsdlRM5qkkIwQGCqU.jpg",
    …
}
12: {
    id: 581387,
    title: "Ashfall",
    overview: "Stagnant since 1903, at an elevation of 9000', a v…pts on the mythical and majestic Baekdu Mountain.",
    popularity: 936.329,
    poster_path: "/zoeKREZ2IdAUnXISYCS0E6H5BVh.jpg",
    …
}
13: {
    id: 539885,
    title: "Ava",
    overview: "A black ops assassin is forced to fight for her own survival after a job goes dangerously wrong.",
    popularity: 829.853,
    poster_path: "/qzA87Wf4jo1h8JMk9GilyIYvwsA.jpg",
    …
}
14: {
    id: 553604,
    title: "Honest Thief",
    overview: "A bank robber tries to turn himself in because he'…t than him, he must fight back to clear his name.",
    popularity: 814.934,
    poster_path: "/zeD4PabP6099gpE0STWJrJrCBCs.jpg",
    …
}
15: {
    id: 520946,
    title: "100% Wolf",
    overview: "Freddy Lupin, heir to a proud family line of werew…ay named Batty, Freddy must prove he's 100% Wolf.",
    popularity: 752.919,
    poster_path: "/2VrvxK4yxNCU6KVgo5TADJeBEQu.jpg",
    …
}
16: {
    id: 529203,
    title: "The Croods: A New Age",
    overview: "Searching for a safer habitat, the prehistoric Cro… strength from one another, and survive together.",
    popularity: 707.737,
    poster_path: "/tK1zy5BsCt1J4OzoDicXmr0UTFH.jpg",
    …
}
17: {
    id: 737568,
    title: "The Doorman",
    overview: "A former Marine turned doorman at a luxury New Yor…n her deadly fighting skills to end the showdown.",
    popularity: 709.055,
    poster_path: "/pklyUbh4k1DbHdnsOMASyw7C6NH.jpg",
    …
}
18: {
    id: 524047,
    title: "Greenland",
    overview: "John Garrity, his estranged wife and their young s… and last-minute flight to a possible safe haven.",
    popularity: 684.669,
    poster_path: "/bNo2mcvSwIvnx8K6y1euAc1TLVq.jpg",
    …
}
19: {
    id: 723072,
    title: "Host",
    overview: "Six friends hire a medium to hold a séance via Zoo…egin to realize they might not survive the night.",
    popularity: 611.35,
    poster_path: "/h7dZpJDORYs5c56dydbrLFkEXpE.jpg",
    …
}
 ```
</details>

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->
## Project status 
* ✅  Render hello world server side   
* ✅  Fetching API server side   
* ✅  Re-create wep app with ejs templating  
* ✅  Render api data with ejs  
* ✅  Get the search feature to work with `post`  
* ✅  Refactor code modulair   
* ✅  Deploy the app on heroku  
* ✅  Make a build script for CSS   
* ✅  Make a build script for JS  
* ✅  Service worker  
* ✅  Render offline page  
* ✅  Render core assets like css and javascript  
* ✅  Save pages to cache  
* ✅  Render pages from cache  
* ✅  Render specific pages from web unless offline  
* ✅  Compress files with Gzip  
* ✅  Minify CSS and JS
* ✅  Apply critical CSS before the rest of the css
* ✅  Finish readme 

To update in the future
* ❌  Font optimalization 
* ❌  Responsive images  
* ❌  Static HTML build script  
* ❌  Feature recently watched movie  
* ❌  Search doenst work optimal, maybe sessions  



<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
## License
[MIT](https://github.com/NathanNeelis/progressive-web-apps-2021/blob/master/LICENSE)  

## Resources
[express](https://expressjs.com/en/starter/installing.html)  
[EJS](https://ejs.co/#install)  
[npm localstorage](https://www.npmjs.com/package/node-localstorage)  
[node localstorage](https://stackoverflow.com/questions/10358100/how-to-access-localstorage-in-node-js) stackoverflow  
[npm gulp](https://www.npmjs.com/package/gulp)  
[compression with node](https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9)  
[video gzip with node](https://www.youtube.com/watch?v=jZ6x5Ab7Bgc)  
[npm compression](https://www.npmjs.com/package/compression)  
[clients claim](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim)  
[cache storage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)  
[cache storage keys](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys)  
[target url](https://github.com/w3c/ServiceWorker/issues/985#issuecomment-253755588)  
[target url 2](https://stackoverflow.com/questions/45663796/setting-service-worker-to-exclude-certain-urls-only/45670014#45670014)  
[Declan movies example](https://github.com/cmda-minor-web/progressive-web-apps-2021/tree/master/examples/node-advanced-movies-example)  
[critical css](https://web.dev/defer-non-critical-css/)  
[Font loading Performance](https://www.youtube.com/watch?v=vTf9HRTWKtM)  
