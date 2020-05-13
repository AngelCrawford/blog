"use strict";

// TODO: Lupe als Button ausstatten, damit man auch durch Klick auf die Lupe die Suche starten kann
// TODO: disabled State für Input und Button anpassen!!
// THANKS: https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/

var searchFn = function () {
  var lastTerm = "You are likely to be eaten by a grue.";
  var stopwords = ["aber", "als", "am", "an", "auch", "auf", "aus", "bei", "bin", "bis", "bist", "da", "dadurch", "daher", "darum", "das", "daß", "dass", 
    "dein", "deine", "dem", "den", "der", "des", "dessen", "deshalb", "die", "dies", "dieser", "dieses", "doch", "dort", "du", 
    "durch", "ein", "eine", "einem", "einen", "einer", "eines", "er", "es", "euer", "eure", "für", "hatte", "hatten", "hattest", 
    "hattet", "hier", "hinter", "ich", "ihr", "ihre", "im", "in", "ist", "ja", "jede", "jedem", "jeden", "jeder", "jedes", "jener", 
    "jenes", "jetzt", "kann", "kannst", "können", "könnt", "machen", "mein", "meine", "mit", "muß", "mußt", "musst", "müssen", "müßt", 
    "nach", "nachdem", "nein", "nicht", "nun", "oder", "seid", "sein", "seine", "sich", "sie", "sind", "soll", "sollen", "sollst", "sollt", "sonst", 
    "soweit", "sowie", "und", "unser", "unsere", "unter", "vom", "von", "vor", "wann", "warum", "was", "weiter", "weitere", "wenn", "wer", "werde", "werden", 
    "werdet", "weshalb", "wie", "wieder", "wieso", "wir", "wird", "wirst", "wo", "woher", "wohin", "zu", "zum", "zur", "über"];
  var normalizer = document.createElement("textarea");
  var normalize = function (input) {
    normalizer.innerHTML = input;
    var inputDecoded = normalizer.value;
    return " " + inputDecoded.trim().toLowerCase().replace(/[^0-9a-z ]/gi, " ").replace(/\s+/g, " ") + " ";
  }
  var limit = 30;
  var minChars = 3;
  var searching = false;
  
  // Returning Results
  var render = function (results) {
    results.sort(function (a, b) { return b.weight - a.weight; });
      for (var i = 0; i < results.length && i < limit; i += 1) {
        var result = results[i].item;
        var openAnchor = "<a href=\"" + result.permalink + "\" " + "alt=\"" + result.showTitle + "\" class=\"title\">";
        var resultPane = "<div class=\"columns\">" +
          "<div class=\"column is-one-quarter image\">" + openAnchor + "<img src=\"" + result.image + "\"></a></div>" +
          "<div class=\"column\">" + openAnchor + result.showTitle + "</a>" + 
          "<div class=\"content\">" + result.showContent.substr(0, 300) + 
          "<div class=\"tags-wrapper\">" + 
          "<svg class=\"remix-small\"><use xlink:href=\"/fonts/remixicon/remixicon.symbol.svg#price-tag-3-line\"></use></svg>" + 
          result.tags + "</div></div>" +
          "</div>";
        $("#results").append(resultPane);
      }
  };
  // count number of hits in a target
  var checkTerms = function (terms, weight, target) {
    var weightResult = 0;
    terms.forEach(function (term) {
      if (~target.indexOf(term.term)) {
        var idx = target.indexOf(term.term);
        while (~idx) {
          weightResult += term.weight * weight;
          idx = target.indexOf(term.term, idx + 1);
        }
      }
    });
    return weightResult;
  };
  // The Search Algorithm
  var search = function (terms) {
    var results = [];
    searchHost.index.forEach(function (item) {
      if (item.tags) {
        var weight_1 = 0;
          terms.forEach(function (term) {
            if (item.title.startsWith(term.term)) {
              weight_1 += term.weight * 32;
            }
          });
          weight_1 += checkTerms(terms, 1, item.content);
          weight_1 += checkTerms(terms, 2, item.description);
          weight_1 += checkTerms(terms, 2, item.subtitle);
          item.tags.forEach(function (tag) {
            weight_1 += checkTerms(terms, 4, tag);
          });
        weight_1 += checkTerms(terms, 16, item.title);
        if (weight_1) {
          results.push({
            weight: weight_1,
            item: item
          });
        }
      }
    });
    if (results.length) {
      var resultsMessage = results.length + " Ergebnisse gefunden.";
      if (results.length > limit) {
        resultsMessage += " Showing first " + limit + " results.";
      }
      $("#results").html("<p>" + resultsMessage + "</p>");
        render(results);
      }
    else {
      $("#results").html('<p>Keine Ergebnisse gefunden.</p>');
    }
  };
  
  var runSearch = function () {
    if (searching) {
      return;
    }
    var term = normalize($("#searchBox").val()).trim();
    if (term === lastTerm) {
      return;
    }
    lastTerm = term;
    if (term.length < minChars) {
      $("#results").html('<p>Bitte gib\' mehr als drei Zeichen ein.</p>');
      $("#spinnerLoading").hide();
      $("#searchIcons svg.remix.lens").hide();
      $("#searchIcons svg.remix.close").show();
      return;
    }

    $("#spinnerLoading").show();
    $("#searchIcons svg.remix.lens").hide();
    $("#searchIcons svg.remix.close").hide();
    searching = true;
    var startSearch = new Date();
    var terms = term.split(" ");
    var termsTree = [];
    for (var i = 0; i < terms.length; i += 1) {
      for (var j = i; j < terms.length; j += 1) {
        var weight = Math.pow(2, j - i);
        var str = "";
        for (var k = i; k <= j; k += 1) {
          str += (terms[k] + " ");
        }
        var newTerm = str.trim();
        if (newTerm.length >= minChars && stopwords.indexOf(newTerm) < 0) {
          termsTree.push({
            weight: weight,
            term: " " + str.trim() + " "
          });
        }
      }
    }
    search(termsTree);
    searching = false;
    var endSearch = new Date();
    $("#results").append("<p><small>Die Suche brauchte " + (endSearch - startSearch) + "ms.</small></p>");
    $("#spinnerLoading").hide();
    $("#searchIcons svg.remix.lens").hide();
    $("#searchIcons svg.remix.close").show();
  };

  var initSearch = function () {
    $('#searchBox').focus(function()  {
      
      $("#searchBox").keyup(function () {
        
        if ( $("#searchBox").val().length === 0 ) {
          $("#resultsWrapper").fadeOut();
        } else {
          $("#resultsWrapper").fadeIn();
        }
        runSearch();
      });
    });

    // runSearch();
  };

  $(document).mouseup(function(e) {
    if (!$("#resultsWrapper").is(e.target) && $("#resultsWrapper").has(e.target).length === 0) {
      $("#resultsWrapper").hide();
    }
  });

  $("#searchIcons svg.remix.close").on("click", function(e) {
    $("input#searchBox").val("");
    $("#searchIcons svg.remix.lens").show();
    $("#searchIcons svg.remix.close").hide();
    $("#resultsWrapper").hide();
  });

  $("#spinnerLoading").hide();
  $("#searchIcons svg.remix.lens").show();
  $("#searchIcons svg.remix.close").hide();
  $("#resultsWrapper").hide();
  var searchHost = {};

  $.getJSON("/index.json", function (results) {
    searchHost.index = [];
    var dup = {};
    results.forEach(function (result) {
      if (result.tags && !dup[result.permalink]) {
        var res = {};
        res.showTitle = result.title;
        res.showContent = result.content;
        res.title = normalize(result.title);
        res.subtitle = normalize(result.subtitle);
        res.description = normalize(result.description);
        res.content = normalize(result.content);
        var newTags_1 = [];
        result.tags.forEach(function (tag) {
          return newTags_1.push(normalize(tag));
        });
        res.tags = newTags_1;
        res.permalink = result.permalink;
        res.image = result.image;
        searchHost.index.push(res);
        dup[result.permalink] = true;
      }
    });
    
    initSearch();
  });
};
window.addEventListener("DOMContentLoaded", searchFn);