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

function checkOnStart() {
 var refLine = document.querySelector('input[name="line-select"]:checked')
 checkLine(refLine);
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
  //Case: The reference line is edited
  if (myLine.querySelector(".reference-button").checked) {
    referenceLine = myLine.querySelector(".line-text").value;
    myMissingLetters.innerHTML = "";
    myExtraLetters.innerHTML = "";
    for (let line of lineArray) {
      if (!line.querySelector(".reference-button").checked) {
        var missingLetters = line.querySelector(".missing-letters");
        var extraLetters = line.querySelector(".extra-letters");
        var text = line.querySelector(".line-text").value;
        var result = compareToReference(text);
        missingLetters.innerHTML = "- " + result.missingLetters;
        extraLetters.innerHTML = "+ " + result.extraLetters;
      }
    }
  } else { //This line is not the reference line
    var text = myLine.querySelector(".line-text").value;
    var result = compareToReference(text);
    myMissingLetters.innerHTML = "- " + result.missingLetters;
    myExtraLetters.innerHTML = "+ " + result.extraLetters;
  }
}

function compareToReference(text) {
  var processedText = clean(text).split("").sort();
  var processedRef = clean(referenceLine).split("").sort();

  return compareLetters(processedText, processedRef);
}

function clean(text) {
  return text.toLowerCase().replace(/[\s!-\?]/g, "")
}

function compareLetters(text, reference) {
  var missingLetters = []
  var extraLetters = []

  //compare the sorted lists character by character
  while (reference.length > 0 && text.length > 0) {
    if (reference[0] < text[0]) { // ref letters not in the text
      missingLetters.push(reference.shift());
    } else if (text[0] == reference[0]) { //the letter is in both
      reference.shift();
      text.shift();
    } else if (text[0] < reference[0]) { //text letters not in the ref
      extraLetters.push(text.shift());
    }
  }

  extraLetters = extraLetters.concat(text); //if it's still in the text, it's extra
  missingLetters = missingLetters.concat(reference); //if it's still in the ref, it's missing

  return {
    missingLetters: missingLetters.join(""), 
    extraLetters: extraLetters.join("")
  };
}
