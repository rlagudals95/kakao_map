import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash"; // _안에 디바운스와 쓰로틀이 들어가 있다

const { kakao } = window;

const Location = () => {
  const [search, setSearch] = useState(""); // search가 변경 될때마다 화면 렌더링
  //조건 걸어주기 // 나를 기준으로 몇 km 이내

  const debounce = _.debounce((e) => {
    // 이래야 화면 렌더링이 계속안된다
    setSearch(e.target.value);
  }, 300); //키보드 떼면 입력한게 1초 뒤에 나타난다

  useEffect(() => {
    // 지도 띄우기
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(37.526667, 127.028011), //지도 중심(시작) 좌표
      level: 3, //지도 확대 레벨
    };

    var map = new kakao.maps.Map(container, options); // 지도생성
    var markerPosition = new kakao.maps.LatLng(
      37.465264512305174,
      127.10676860117488
    );
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 카테고리 별 검색 기능/////////////////////

    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 장소 검색 객체를 생성합니다
    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch(`${search}`, placesSearchCB); // 여길 바꿔주면 검색이 된다

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    }

    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
  }, [search]);

  console.log(search);
  return (
    <MapBox>
      <div>
        <input type="text" onChange={debounce} />
        {/* <button
          onClick={() => {
            setSearch(search);
          }}
        >
          검색하기
        </button> */}
      </div>
      <div id="map" style={{ width: "800px", height: "700px" }}></div>
    </MapBox>
  );
};

const MapBox = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export default Location;
