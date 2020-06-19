var referenceLine = ""

function addLine(element) {
  var myLine = element.parentNode;
  var newLine = myLine.cloneNode(true);
  myLine.after(newLine);
}

function removeLine(element) {
  var lineArray = document.getElementById("line-array")
  if (lineArray.childElementCount > 1) {
    element.parentNode.remove();
  }
}

function updateReferenceLine(element) {
  var lineText = element.parentNode.querySelector(".line-text")
  referenceLine = lineText.value;
  checkLine(element);
}

function checkLine(element) {
  var lineArray = document.getElementsByClassName("line");
  var myLine = element.parentNode
  var myMissingLetters = myLine.querySelector(".missing-letters");
  var myExtraLetters = myLine.querySelector(".extra-letters");
  if (myLine.querySelector(".reference-button").checked) {
    referenceLine = myLine.querySelector(".line-text").value;
    myMissingLetters.innerHTML = "";
    myExtraLetters.innerHTML = "";
  }
  for (let line of lineArray) {
    if (!line.querySelector(".reference-button").checked) {
      var missingLetters = line.querySelector(".missing-letters");
      var extraLetters = line.querySelector(".extra-letters");
      var text = line.querySelector(".line-text").value;
      var result = compareToReference(text);
      missingLetters.innerHTML = result.missingLetters;
      extraLetters.innerHTML = result.extraLetters;
    }
  }
}

// something is wrong with this. Maybe the text is getting simultaneously
// updated in multiple spots which is causing inaccuracies. Arrays seem to have
// different lenghts in different spots.
function compareToReference(text) {
  var processedText = clean(text).split("").sort();
  var processedRef = clean(referenceLine).split("").sort();
  console.log(processedText);
  console.log(processedRef);

  return compareLetters(processedText, processedRef);
}

function clean(text) {
  return text.toLowerCase().replace(/[\s!-\?]/g, "")
}

function compareLetters(text, reference) {
  var missingLetters = []
  var extraLetters = []
  text.forEach(function (c) {
    if (reference.length == 0) {
      return
    }
    while (reference[0] < c) {
      missingLetters.push(reference.shift());
    }
    if (reference.length == 0) {
      return
    }
    if (c == reference[0]) {
      reference.shift();
    } else {
      extraLetters.push(c);
    }
  });
  return {
    missingLetters: missingLetters.join(""), 
    extraLetters: extraLetters.join("")
  };
}
