let travel = new XMLHttpRequest();
travel.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
travel.send(null);
travel.onload = function() {
    if(travel.status !== 200) {return;};
    let data = JSON.parse(travel.responseText).result.records;

    // DOM
    let selectBar = document.getElementById("selectBar");
    let pageSelect = document.querySelector(".pageNumber");
    let show = document.querySelector(".show");
    let titleZone = document.querySelector(".titleZone");
    let hotZone = document.querySelectorAll("input");

    let SelectTripData = [];
    let selectPage = 1;

    // Function
    // 初始化
    function init() {
        zoneSelect();
        selectData('all');
    }
    // 選單內容
    function zoneSelect(e) {
        let AryZone = new Array();
        let selectBar = document.getElementById("selectBar");
        let str = '<option value="" disabled="disabled" selected>--請選擇行政區--</option>';
        for (let i = 0; i < data.length; i++) {
            AryZone.push(data[i].Zone);
        }
        AryZone = ([...new Set(AryZone)]);
        for (let i = 0; i < AryZone.length; i++) {
            str += '<option value="' +AryZone[i]+ '">' +AryZone[i]+ '</option>';
        }
        selectBar.innerHTML = str;
    }
    // 點擊選單，將資料放在 SelectTripData
    function selectData(zone) {
        if (zone === 'all') {
            let tripData = data;
            SelectTripData = tripData;
            titleZone.innerHTML = "高雄旅遊景點";
        } else {
            let tripData = data.filter(trip => trip.Zone===zone);
            SelectTripData = tripData;
            titleZone.innerHTML = zone;
        }
        // Default show the first page data(no1~no8)
        RenderPageNumber(1);
        SelectPageData(1);
        selectPage = 1;
    }
    // 渲染分頁 ul.pageNumber
    function RenderPageNumber(pageNum) {
        let totalPage = Math.ceil(SelectTripData.length / 8);
        let str = '';
        let prevPage = '<li class="page-item prev">◀ Prev</li>';
        let nextPage = '<li class="page-item next">Next ▶</li>';
        for (let i = 1; i <= totalPage; i++) {
            if (i === pageNum) {
                str += '<li class="page-item-number active">' +i+ '</li>';
            } else {
                str += '<li class="page-item-number">' +i+ '</li>';
            }
        }
        if (pageNum === 1 & totalPage > 1) {
            pageSelect.innerHTML = str + nextPage;
        }else if (pageNum === totalPage & totalPage > 1) {
            pageSelect.innerHTML = prevPage + str;
        } else if (totalPage > 1) {
            pageSelect.innerHTML = prevPage + str + nextPage;
        } else {
            pageSelect.innerHTML = '';
        }
        console.log(pageSelect);
        console.log(SelectTripData.length);
        console.log(totalPage);
    }
    // 製作內容分頁
    function SelectPageData(pageNum) {
        let item = SelectTripData.slice((pageNum - 1) * 8, pageNum * 8);
        let str = '';
        for (let i = 0; i < item.length; i++) {
            str += '<div class="card"><div class="card-header"><img src="' +item[i].Picture1+ '"><ul><li style="font-size: 24px;">' +item[i].Name+ '</li><li style="font-size: 16px;">' +item[i].Zone+ '</li></ul></div><div class="card-body"><ul><li><img src="images/icons_clock.png">' +item[i].Opentime+ '</li><li><img src="images/icons_pin.png">' +item[i].Add+ '</li><li><img src="images/icons_phone.png">' +item[i].Tel+ '</li></ul><span><img src="images/icons_tag.png">' +item[i].Ticketinfo+ '</span></div></div>';
        }
        show.innerHTML = str;
    }
    // 點擊頁碼，然後渲染div.show
    function changePage(e) {
        let pageNum = Number(e.target.innerText);
        // Click page number
        if (e.target.className === 'page-item-number') {
            SelectPageData(pageNum);
            RenderPageNumber(pageNum);
            selectPage = pageNum;
        }
        // Click next
        if (e.target.className === 'page-item next') {
            let nextPage = selectPage + 1;
            selectPage = nextPage;
            SelectPageData(nextPage);
            RenderPageNumber(nextPage);
        }
        // Click prev
        if (e.target.className === 'page-item prev') {
            let prevPage = selectPage - 1;
            selectPage = prevPage;
            SelectPageData(prevPage);
            RenderPageNumber(prevPage);
        }
    }
    
    function changeZone(e) {
        selectData(e.target.value);
    }
    // 監聽
    pageSelect.addEventListener('click', changePage, false);
    selectBar.addEventListener('change', changeZone, false);
    for (let i = 0; i < hotZone.length; i++) {
        hotZone[i].addEventListener('click', changeZone, false);
    }
    // 載入初始頁面
    init();
    // 置頂頁籤
    $(window).scroll(function() {
        var height = $(window).scrollTop();
        if (height > 100) {
          $("a#goTop").fadeIn();
        } else {
          $("a#goTop").fadeOut();
        }
      });
      $(document).ready(function() {
        $("a#goTop").click(function(event) {
          event.preventDefault();
          $("html, body").animate({scrollTop:0}, 800);
        });
      });
}