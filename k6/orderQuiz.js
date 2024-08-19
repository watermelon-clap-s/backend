import http from 'k6/http';
import { sleep, check } from 'k6';
const port = 8080
const server = "3.36.51.22"

export const options = {
    vus: 1000,  //천명이
    duration:'10s',//10초동안
 // 테스트 지속 시간
    throattle:{
        rate: 1000, //1000ms마다
        type: "fpm",
    }
};

export default function () {
    let response = http.get(server+':'+port);

    // 응답 확인 (필요에 따라 수정)
    check(response, {
        'status was 200': (r) => r.status === 200,
    });

    sleep(1); // 각 가상 사용자가 1초 대기
}