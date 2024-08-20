import http from 'k6/http';
import { sleep, check } from 'k6';
const port = 8092
const server = "http://localhost"

export const options = {
    vus: 10000,  //만명이
    duration:'2s',//2초동안
    throattle:{
        rate: 1000, //1000ms마다
        type: "fpm",
    }
};
export default function () {
    let response = http.get(server+':'+port+"/event/order");
    // 응답 확인 (필요에 따라 수정)
    check(response, {
        'status was 200': (r) => r.status === 200,
    });
    
    // sleep(1); // 각 가상 사용자가 1초 대기
}