function getDateString(nDate) {
  let nDateDate = nDate.getDate();
  let nDateMonth = nDate.getMonth() + 1;
  let nDateYear = nDate.getFullYear();
  if (nDateDate < 10) { nDateDate = "0" + nDateDate; };
  if (nDateMonth < 10) { nDateMonth = "0" + nDateMonth; };
  let presentDate = "" + nDateYear + "-" + nDateMonth + "-" + nDateDate;
  return presentDate;
}
function getDomain(tablink) {
  let url = tablink[0].url;
  return url.split("/")[2];
};

function secondsToString(seconds, compressed = false) {
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  let timeString = "";
  if (hours) {
    timeString += hours + " hrs ";
  }
  if (minutes) {
    timeString += minutes + " min ";
  }
  if (seconds) {
    timeString += seconds + " sec "
  }
  if (!compressed) {
    return timeString;
  }
  else {
    if (hours) {
      return (`${hours}h`);
    }
    if (minutes) {
      return (`${minutes}m`);
    }
    if (seconds) {
      return (`${seconds}s`);
    }
  }
};
var allKeys, timeSpent, totalTimeSpent, sortedTimeList, topCount, topDataSet, topLabels, dateChart;
var color = [
  "rgb(0, 128, 0)",      // dark green
  "rgb(60, 179, 113)",   // medium sea green
  "rgb(144, 238, 144)",  // light green
  "rgb(173, 255, 47)",   // green-yellow
  "rgb(255, 255, 0)",    // yellow
  "rgb(255, 255, 102)",  // light yellow
  "rgb(192, 192, 192)",  // silver gray
  "rgb(169, 169, 169)",  // dark gray
  "rgb(128, 128, 128)",  // gray
  "rgb(105, 105, 105)"   // dim gray
];
totalTimeSpent = 0;
var today = getDateString(new Date())
chrome.storage.local.get(today, function (storedItems) {
  if (!storedItems[today]) {
    console.log("No data found for today: " + today);
    return;
  }
  allKeys = Object.keys(storedItems[today]);
  timeSpent = [];
  sortedTimeList = [];
  for (let i = 0; i < allKeys.length; i++) {
    let webURL = allKeys[i];
    timeSpent.push(storedItems[today][webURL]);
    totalTimeSpent += storedItems[today][webURL];
    sortedTimeList.push([webURL, storedItems[today][webURL]]);
  }
  sortedTimeList.sort((a, b) => b[1] - a[1]);
  console.log(sortedTimeList);

  topCount = allKeys.length > 10 ? 10 : allKeys.length;
  console.log(topCount);

  document.getElementById("totalTimeToday").innerText = secondsToString(totalTimeSpent);
  topDataSet = [];
  topLabels = [];
  for (let j = 0; j < topCount; j++) {
    topDataSet.push(sortedTimeList[j][1]);
    topLabels.push(sortedTimeList[j][0]);
  }


  const webTable = document.getElementById('webList');
  for (let i = 0; i < allKeys.length; i++) {
    let webURL = sortedTimeList[i][0];
    let row = document.createElement('tr');
    let siteURL = document.createElement('td');
    siteURL.innerText = webURL;
    let siteTime = document.createElement('td');
    siteTime.innerText = secondsToString(sortedTimeList[i][1]);
    row.appendChild(siteURL);
    row.appendChild(siteTime);
    webTable.appendChild(row);
    console.log(row);
  }

  new Chart(document.getElementById("pie-chart"), {
    type: 'doughnut',
    data: {
      labels: topLabels,
      datasets: [{
        label: "Time Spent",
        backgroundColor: color,
        data: topDataSet
      }]
    },
    options: {
      legend: {
        display: true
      }
    }
  });

});

chrome.storage.local.get(null, function (items) {
  let datesStored = Object.keys(items);
  datesStored.sort();
  const calendar = document.getElementById("dateValue");
  let minDate = datesStored[0];
  let maxDate = datesStored[datesStored.length - 1];
  calendar.min = minDate;
  calendar.max = maxDate;
});


document.addEventListener('DOMContentLoaded', () => {
  const dateSubmitBtn = document.getElementById("dateSubmit");
  if (dateSubmitBtn) {
    dateSubmitBtn.addEventListener('click', function () {
      const calendar = document.getElementById("dateValue");
      if (calendar.value === "") {
        document.getElementById("tryAgain").innerText = "Invalid date! Please try again.";
        document.getElementById("tryAgain").classList.remove("d-none");
      }
      else {
        document.getElementById("tryAgain").classList.add("d-none");
        let givenDate = calendar.value;
        chrome.storage.local.get(givenDate, function (thatDay) {
          if (thatDay[givenDate] == null) {
            document.getElementById("tryAgain").innerText = "No records exist for this day!";
            document.getElementById("tryAgain").classList.remove("d-none");
          }
          else {
            let sites = Object.keys(thatDay[givenDate]);
            let times = [];
            for (let i = 0; i < sites.length; i++) {
              times.push([sites[i], thatDay[givenDate][sites[i]]]);
            }
            times.sort(function (a, b) { return b[1] - a[1] });
            let topTen = times.length > 10 ? 10 : times.length;
            let dataSet = [];
            let thatDayTotal = 0;
            let dataSetLabels = [];
            for (let i = 0; i < topTen; i++) {
              dataSet.push(times[i][1]);
              dataSetLabels.push(times[i][0]);
              thatDayTotal += times[i][1];
            }
            let chartTitle = "Visited Sites on " + givenDate;
            if (dateChart) {
              dateChart.destroy()
            }
            dateChart = new Chart(document.getElementById("differentDayChart"), {
              type: 'doughnut',
              data: {
                labels: dataSetLabels,
                datasets: [{
                  label: "Time Spent",
                  backgroundColor: color,
                  data: dataSet
                }]
              },
              options: {
                title: {
                  display: true,
                  text: chartTitle
                },
                legend: {
                  display: true
                }
              }
            });
            document.getElementById("statsRow").classList.remove("hidden");
            document.getElementById("totalTimeThatDay").innerText = secondsToString(thatDayTotal);
            const webList2 = document.getElementById("webList2");
            while (webList2.firstChild) {
              webList2.removeChild(webList2.lastChild);
            }
            for (let i = 0; i < times.length; i++) {
              let row = document.createElement('tr');
              let col2 = document.createElement('td');
              col2.innerText = times[i][0];
              let col3 = document.createElement('td');
              col3.innerText = secondsToString(times[i][1]);
              row.appendChild(col2);
              row.appendChild(col3);
              webList2.appendChild(row);
            }
          }

        });
      }
    });
  }
});

function getDateTotalTime(storedObject, date) {
  let websiteLinks = Object.keys(storedObject[date]);
  let noOfWebsites = websiteLinks.length;
  let totalTime = 0;
  for (let i = 0; i < noOfWebsites; i++) {
    totalTime += storedObject[date][websiteLinks[i]];
  }
  return totalTime;
};
var monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

document.addEventListener('DOMContentLoaded', () => {
  // Add tab switching functionality
  const tabs = document.querySelectorAll('#tabs a');
  const tabContents = document.querySelectorAll('#tabContent > div');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active classes
      tabs.forEach(t => t.classList.remove('active', 'text-blue-600'));
      tabContents.forEach(tc => tc.classList.add('hidden'));
      tabContents.forEach(tc => tc.classList.remove('block'));
      // Add active class to clicked tab
      tab.classList.add('active', 'text-blue-600');
      // Show corresponding tab content
      const target = tab.getAttribute('href').substring(1);
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.remove('hidden');
        activeContent.classList.add('block');
      }
    });
  });

  // Add toggle functionality for "See Detailed View" buttons
  const detailBtns = [document.getElementById('detailBtn'), document.getElementById('detailBtn2')];
  const detailDivs = [document.getElementById('webListDiv'), document.getElementById('webListDiv2')];

  detailBtns.forEach((btn, index) => {
    if (btn && detailDivs[index]) {
      btn.addEventListener('click', () => {
        if (detailDivs[index].classList.contains('hidden')) {
          detailDivs[index].classList.remove('hidden');
        } else {
          detailDivs[index].classList.add('hidden');
        }
      });
    }
  });
});
