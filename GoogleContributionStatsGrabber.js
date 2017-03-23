/*
 * Google Contribution Stats Grabber
 *
 * .section-photo-bucket-content		(one place, with title and multiple photos)
 *     .section-photo-bucket-header
 *        .section-photo-bucket-title			(Name)
 *        .section-photo-bucket-icon (Main photo of area)
 *     .section-photo-bucket-subtitle	(Address)
 *     .section-photo-bucket-photos		(multiple photos possible)
 *        .section-photo-bucket-photo-container
 *        .maps-sprite-photos-view-count		(Number of Views)
 */

(function grabStats() {
    window.STATSGRABBER = window.STATSGRABBER || {};

    var globalStats = {
        "countVisibleItems": 0,
        "countExtractedItems": 0,
        "countGlobalViews": 0,
        "countMainPhotos": 0
    };

    var TRANSLATION = {
        "countVisibleItems": "sichtbare Plätze ",
        "countMainPhotos": "x Hauptbild",
        "countExtractedItems": "extrahierte Fotos",
        "countGlobalViews": "Ansichten insgesamt",
        "callToAction": "Ansichtsdaten extrahieren und als CSV Datei herunterladen"
    };

    function setUpHtml() {
        var oldGrabBox = document.querySelector('#grabBox');
        if (oldGrabBox) {
            oldGrabBox.parentNode.removeChild(oldGrabBox);
        }
        var grabBox = document.createElement('div'),
            closeButton = document.createElement('button'),
            ulElement = document.createElement('ul');

        grabBox.setAttribute('style', 'position: absolute; top: 10px; left: 260px; background:rgba(175, 175, 175, 0.9); padding: 0.5em; box-shadow: 5px 5px 20px #6f6f6f;');
        grabBox.setAttribute('id', 'grabBox');
        closeButton.setAttribute('style', ' height: 2em; width: 2em; position: absolute; top: 0; right: 0;');
        closeButton.innerHTML = 'X';
        closeButton.addEventListener('click', function () {
            document.body.removeChild(grabBox)
        });

        grabBox.appendChild(closeButton);
        grabBox.appendChild(ulElement);

        var text = TRANSLATION["countVisibleItems"] + " : " + globalStats["countVisibleItems"]
            + " ( " + globalStats["countMainPhotos"] + " " + TRANSLATION["countMainPhotos"] + ")";
        createElementAndAppendTo('li', text, ulElement);
        text = TRANSLATION["countExtractedItems"] + " : " + globalStats["countExtractedItems"];
        createElementAndAppendTo('li', text, ulElement);
        text = TRANSLATION["countGlobalViews"] + " : " + globalStats["countGlobalViews"];
        createElementAndAppendTo('li', text, ulElement);

        var liAction = createElementAndAppendTo('li', "", ulElement);
        var aClick = createElementAndAppendTo('a', TRANSLATION.callToAction, liAction);
        aClick.setAttribute("onclick", "window.STATSGRABBER.extractData(); window.STATSGRABBER.setUpHtml();");

        function createElementAndAppendTo(tag, nodeContent, parent) {
            var element = document.createElement(tag);
            element.innerHTML = nodeContent;
            parent.appendChild(element);
            return element;
        }

        /*final step: append box to DOM*/
        document.body.appendChild(grabBox);
    }

    setUpHtml();

    function isSameImage(mainPhotoCSS, currentPhoto) {
        // main image: background-image:url(//
        //             lh6.googleusercontent.com/-ZOXccXWuppo/WKihlR7uoZI/AAAAAAABppI/iDtXz92-NbQP7KQpmnXhMN6pCtWHEfMpACLIB/w36-h36-p-k-no/)
        // photo list: lh6.googleusercontent.com/-ZOXccXWuppo/WKihlR7uoZI/AAAAAAABpqE/t030Tq2WczokQTAAIFWhrixZEmmfSN9swCLIB/w102-h168-p-k-no/
        //             ^ ................................................^ equal. Suffix IDs and dimensions can be swapped

        if (!currentPhoto) {
            // handle live loading
            return false;
        } else {
            var mainUrl = getImageUID(mainPhotoCSS);
            return currentPhoto.src.indexOf(mainUrl) !== -1;
        }
    }

    function getImageUID(imgSrc) {
        var mainUrlParts = imgSrc.slice(23).split('/');// trim 'background-image:url(//' and get content between slashes
        return mainUrlParts[1] + '/' + mainUrlParts[2];

    }

    function getViewCountAsNumber(node) {
        // remove decimal dots
        return node ? parseInt(node.innerText.split('.').join(''), 10) : undefined;
    }

    function exportToCsvFile(csvContent) {
        // taken from http://stackoverflow.com/a/14966131/2354488
        var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "googleStats.csv");
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file
        link.parentNode.removeChild(link);
    }

    function extractData() {
        globalStats.countGlobalViews = 0;
        globalStats.countMainPhotos = 0;
        globalStats.countExtractedItems = 0;
        globalStats.countVisibleItems = 0;

        var resultArray = [];
        resultArray.push('title\taddress\tviews\tisMain\tsourceUID');
        var photoList = document.querySelectorAll('.section-photo-bucket-content');

        photoList.forEach(function (entry) {
            var headerElement = entry.querySelector('.section-photo-bucket-header');
            //main photo is set via div with css background image
            var mainPhotoCssBgUrl = headerElement.querySelector('.section-photo-bucket-icon').getAttribute('style');
            var titleContent = headerElement.querySelector('.section-photo-bucket-title span').innerHTML;
            var addressContent = headerElement.querySelector('.section-photo-bucket-subtitle span').innerHTML;
            var photoList = entry.querySelectorAll('.section-photo-bucket-photo-container');
            var containsMainPhoto = false;

            photoList.forEach(function (photoContainer) {
                var viewCountString = photoContainer.querySelector('.section-photo-bucket-caption-label');
                var viewCount = getViewCountAsNumber(viewCountString);
                var image = photoContainer.querySelector('img');
                var isMainPhoto = isSameImage(mainPhotoCssBgUrl, image);

                containsMainPhoto = containsMainPhoto || isMainPhoto;

                resultArray.push(titleContent + '\t'
                    + addressContent + '\t'
                    + (viewCount || 'n/a') + '\t'
                    + isMainPhoto + '\t'
                    + (image ? getImageUID(image.src) : 'n/a'));

                globalStats.countGlobalViews += (viewCount || 0);
            });

            if (containsMainPhoto) {
                globalStats.countMainPhotos += 1;
                headerElement.setAttribute('style', 'background-color:rgba(181, 255, 157, 0.5)');
                headerElement.setAttribute('title', 'ist Hauptfoto');
            }
        });
        globalStats.countVisibleItems = photoList.length;
        globalStats.countExtractedItems = resultArray.length - 1;

        var csvFormat = resultArray.join('\n');

        exportToCsvFile(csvFormat);
        //window.open(encodeURI(csvFormat));
    }

    window.STATSGRABBER.extractData = extractData;
    window.STATSGRABBER.setUpHtml = setUpHtml;
    window.STATSGRABBER.globalStats = globalStats;
    window.STATSGRABBER.TRANSLATION = TRANSLATION;
})();