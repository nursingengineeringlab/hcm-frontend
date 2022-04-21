import React, { Component } from "react";
import { Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import "./Dashboard.css"
import {
  TeamOutlined,
} from '@ant-design/icons';
import UserList from './UserList.js'
import {exceeded_threshold} from './DeviceType.js'
import { Navbar, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "../Login/LoginActions";
import {http_public_url, mqtt_url, dashboardHeaders} from "../../config.js"
import mqtt from 'mqtt';

// import {ECGPacket} from './ecg_pb'
// https://github.com/improbable-eng/grpc-web/issues/96#issuecomment-347871452
const ecg = require('./ecg_pb');
const { Content, Footer, Sider } = Layout;
const array_len_24h = 1000;

var randomColor = require('randomcolor'); // import the script


var api_base_url = http_public_url;
dashboardHeaders.append('Accept', 'application/json');

class Dashboard extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      flag: false,
      object: ""
    };
    this.OnlineSeniors =  new Map();
  }

  onLogout = () => {
    this.props.logout();
  };


  componentDidMount(){

    let str1 = 'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBckpFME9NV0RvSzArS2Y2RjVpMGRseGVBckFkZTc5N3VrL3A1SWpkWVBtVTlDaE0rCnRNanpUbVdnMFhiUkRFaW1LMFFWbGFPSkduaDFpZHJwVEFUYTl0cTU5eXA4c1BkS2g3YzE3aGNNUUhpZ3NFYzQKcGtsSXJHdnpZU3RWcUhESlljOURySmNwS1VsVDlNR3U4RzMza2JjakliTWc4RmVENVUvQW9Edm9Bek9RR1N5NQorUEM1SEZLSW5DbE9JY0tmcXNmMkJpUWdUSUFxcjVReEVoUE1Cd0VOdFVHSEt2VGUzcFM1bXpQZjFKN21lKzZxCkIxMUo5dnNQQ2o4dTJ1K2l1N1oxS3UvMzZJTDE4bWVWOUora29FVlV2cjllMHdMVjhCN2JRMFVEQ3IyYXZoUFoKMThoeVBTK0tpd3ZKbEZkNFdLWTZPYUp4bFNuNkJoa1RIU1pWWndJREFRQUJBb0lCQUErK1U1QldYTExjKzAzagpmWjNKUWVqVjZSUkl1OTJRYmgyci9UOGs0M1VWMFdMSTdMQ2JvSzduVUt1cmRsanppODFvc2J0c0p3YjJOR3IyClFOQ0JwT1JlZ2hiTmxvQ2ludmNRdk9mU3pIaFpTUGVzRjd2NzlaaGRaTi9aajBBRndpbWRPaVJWeWhpTkt3NnEKV09ad2NlU21XNXNvZDNuVjBoK3FqZjFRV2ROb3kxd01ZOFVRQ0FDRFUzSXVtSDVuOG83NHlQRW5vdUo3dkZ1RApmQjY3bURKN2UrNktsdnpjcVRPUmdoSWsybUd3RkU3eTMwb0p2S0ZKNndWZFVFaW9DRU9sajlYYkhJcFN4RlBTCjkyMUJpVlZQZHpoWE52a0JtNGtEMmRDM2FWYjdwVVBqMStpcDYzYXJiakJBdlB5L1lpNFl0a1BlWXJnNTJocGMKZkptL2VKRUNnWUVBNWZoMlJUeWw3azd0cGg0K2NkYkNubFhTdG0xRURLY01kK2JrRGsxRTRtUkRhS2tzcktiaQp6ZDAwNXBLT3Iwc1dXRHF2ZFBRRnRCa09Ta0FWV20xT1dCSTVHdVFxcHB4clBEOENJcVREUjdjRktZazhQbEZ5CkhjZldQUW9TTVVvbStqK2JGSHhTSDNKWFFSRTB6QUVYeWhxRkxoeERDdHJxMTVRc3E4cjIrdWtDZ1lFQXdCbHgKMURKdWRLSFY3QStleWhpTEV5V2hpN28vVjRGZnRicEQvempFZ3Q5czZ2Y3FKMDgxQzNqalBtUERHSWx0bE5qdwpLR2ZjWDZqNjdYOEJqZlFhYkVscXRQR25YekdwWnZRMU9uRXNjb28vMktyRW4zS1k5Yk5ydkNDOWxkWElmMSs1Cmo1blBka01VQmFzS0JIMmNTNzUvWmtMd0RabWpoblNOaGhpWCs4OENnWUFGRFpDTHRPbHdjd3VGdXVSa1cvT3EKeHZmNlNpeFVtdGNMUzJkM2FQczZmamw4OHpxb0VJS3JRMUVHUC9JaXArTzF6SlJPWFk1Q2hzcHBsejdnM2NYNgo2V3VYeTZ1a1BZdWRwMFRFdmhvTVdWa2pzSUJDWGtmRG44QjFWdU5QY2ZHcFRmeDZWc0QzTCt2NjRnWG05Wjh3Ck1hVDdmbU42dVpTdlovSVRWRUpaQVFLQmdRQ0RwK3l2dGZDbDF0UzZlT29uTURNQTZHV1RVZzVmZHJlVjRSY0IKTUhMZUR5cWl6c3NCTGZQNDdOMHh3VVhRNXo5SEtIZFArZjY3UVNEWTdKYXdKNENFZnJ5M1RuZWJjbm5icWJ0aApWbmRUK1JSUTlwalRmc0wrZ2Yxd2JqQUJKUWZJNUY1VTRPR2k5ODRkSkdBMU83R0c2QVNBblpmUWVsL3NvcXpzCkhxYnJXUUtCZ0hPUTc0aE9LUzhOWkhqME53NHJsd3B0RS9EQ0FXUzloVlRucVdETzJwd09CRlk2UWFvVDE3ODEKejFrRVdFdW5oT3dmR0o0UXFtOHhjZ2lrSzlMY0g2ZTFaVzkwWHI4VTRkRVhGQmVvZjR1TE1WZnVOd1c1WHdEbAo0Ujc0YzI1VUEvcEY0dVFjZ3RlcngrVXJybWU2cisyVWpzNE9nL1RhQWQ2OGlRUXpFMnczCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==';
    let buff1 = Buffer.from(str1, 'base64');
    let key1 = buff1.toString('ascii');

    let str2 = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUZVekNDQkR1Z0F3SUJBZ0lTQkNLbCtVbnZPSVFwWGN4eUpYYm5vWDlKTUEwR0NTcUdTSWIzRFFFQkN3VUEKTURJeEN6QUpCZ05WQkFZVEFsVlRNUll3RkFZRFZRUUtFdzFNWlhRbmN5QkZibU55ZVhCME1Rc3dDUVlEVlFRRApFd0pTTXpBZUZ3MHlNakEwTVRVeU16UXdOVEphRncweU1qQTNNVFF5TXpRd05URmFNREl4TURBdUJnTlZCQU1UCkoyNWxiR0ZpTFdsdVozSmxjM011WldGemRIVnpMbU5zYjNWa1lYQndMbUY2ZFhKbExtTnZiVENDQVNJd0RRWUoKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS3lSTkRqRmc2Q3RQaW4raGVZdEhaY1hnS3dIWHUvZQo3cFA2ZVNJM1dENWxQUW9UUHJUSTgwNWxvTkYyMFF4SXBpdEVGWldqaVJwNGRZbmE2VXdFMnZiYXVmY3FmTEQzClNvZTNOZTRYREVCNG9MQkhPS1pKU0t4cjgyRXJWYWh3eVdIUFE2eVhLU2xKVS9UQnJ2QnQ5NUczSXlHeklQQlgKZytWUHdLQTc2QU16a0Jrc3Vmand1UnhTaUp3cFRpSENuNnJIOWdZa0lFeUFLcStVTVJJVHpBY0JEYlZCaHlyMAozdDZVdVpzejM5U2U1bnZ1cWdkZFNmYjdEd28vTHRydm9ydTJkU3J2OStpQzlmSm5sZlNmcEtCRlZMNi9YdE1DCjFmQWUyME5GQXdxOW1yNFQyZGZJY2owdmlvc0x5WlJYZUZpbU9qbWljWlVwK2dZWkV4MG1WV2NDQXdFQUFhT0MKQW1Fd2dnSmRNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBUVlJS3dZQgpCUVVIQXdJd0RBWURWUjBUQVFIL0JBSXdBREFkQmdOVkhRNEVGZ1FVV0MyQWhzTG1jQ09GS3p3bEs4NjdGY2duCjRHY3dId1lEVlIwakJCZ3dGb0FVRkM2ekY3ZFlWc3V1VUFsQTVoK3ZuWXNVd3NZd1ZRWUlLd1lCQlFVSEFRRUUKU1RCSE1DRUdDQ3NHQVFVRkJ6QUJoaFZvZEhSd09pOHZjak11Ynk1c1pXNWpjaTV2Y21jd0lnWUlLd1lCQlFVSApNQUtHRm1oMGRIQTZMeTl5TXk1cExteGxibU55TG05eVp5OHdNZ1lEVlIwUkJDc3dLWUluYm1Wc1lXSXRhVzVuCmNtVnpjeTVsWVhOMGRYTXVZMnh2ZFdSaGNIQXVZWHAxY21VdVkyOXRNRXdHQTFVZElBUkZNRU13Q0FZR1o0RU0KQVFJQk1EY0dDeXNHQVFRQmd0OFRBUUVCTUNnd0pnWUlLd1lCQlFVSEFnRVdHbWgwZEhBNkx5OWpjSE11YkdWMApjMlZ1WTNKNWNIUXViM0puTUlJQkF3WUtLd1lCQkFIV2VRSUVBZ1NCOUFTQjhRRHZBSFlBMzZWZXEyaUNUeDlzCnJlNjRYMDQrV3VyTm9oS2thbDZPT3hMQUlFUmNLbk1BQUFHQUw5REMzQUFBQkFNQVJ6QkZBaUFzWUM5M0E1M0QKSU80V2g4alR4cTdzZlk1TU1WUnN3cFU4QmZsUjl3Qms0QUloQUpFVzNZOVJ5dW1oR01GSE5ncHFKS21kTTlnawphS0o5ZWJ6ZGxlN2xJdGVjQUhVQVJxVlY2M1g2a1NBd3RhS0phZlR6ZlJFc1FYUysvVW00aGF2eS9IRCtiVWNBCkFBR0FMOUREQUFBQUJBTUFSakJFQWlCbkUrdCtZbzdZcGttT09ieEJpQ1lyRWtwWE50SG1NV2haLzFrVXpkNUUKRkFJZ0dPTlpxVFB3bGhtQzBsS3NVSVNqZFlldytmNnp0dDRrUjZQWXR0b1B2MTB3RFFZSktvWklodmNOQVFFTApCUUFEZ2dFQkFDUXYvN2ExY2QrZjZwbWU5NVRYUzVpUlgzMjR5VFQxOXhpMTdMaU5UQW10OW0wbG0weXFlcmVSCkJyWUdDMUIwTVNjc3NQTDRkbGFhazJLMzJMMFNoTUxUQWJ5a2ZBdDgzWlZYUkd2MW8vdC8xK25OQys0NTNYY0IKQ1VjMUJJU0cxQTRHeVlLTGZwQlZWeThqKzJmQU9qZXloTXl5eTR3MG1CR09iS3IyZXE1MTJPZmgzVTIwTTNRTAp1dGV4RE5QbzNoRThiM0gyRS9uZkRiaHdsbHMwdTZhZUNHT3JzMlZjT3pXQmh4R2RFYXVzRUUrVmQyS3dVa2MxClFET2JOenFYckV6ZXd1eDY2TWVPRU45YXFCUFcwN0lFdjZQQklSRFd6TGp5TC9uWEpMcmprS2oxcGVoVHJScUYKY1h5Q3AyZDhaaEJINVMrWHBxY011WHJSRmJRUHFzYz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQotLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0KTUlJRkZqQ0NBdjZnQXdJQkFnSVJBSkVyQ0VyUERCaW5VL2JXTGlXblgxb3dEUVlKS29aSWh2Y05BUUVMQlFBdwpUekVMTUFrR0ExVUVCaE1DVlZNeEtUQW5CZ05WQkFvVElFbHVkR1Z5Ym1WMElGTmxZM1Z5YVhSNUlGSmxjMlZoCmNtTm9JRWR5YjNWd01SVXdFd1lEVlFRREV3eEpVMUpISUZKdmIzUWdXREV3SGhjTk1qQXdPVEEwTURBd01EQXcKV2hjTk1qVXdPVEUxTVRZd01EQXdXakF5TVFzd0NRWURWUVFHRXdKVlV6RVdNQlFHQTFVRUNoTU5UR1YwSjNNZwpSVzVqY25sd2RERUxNQWtHQTFVRUF4TUNVak13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUM3QWhVb3pQYWdsTk1QRXV5TlZaTEQrSUx4bWFaNlFvaW5YU2FxdFN1NXhVeXhyNDVyK1hYSW85Y1AKUjVRVVZUVlhqSjZvb2prWjlZSThRcWxPYnZVN3d5N2JqY0N3WFBOWk9PZnR6Mm53V2dzYnZzQ1VKQ1dIK2pkeApzeFBuSEt6aG0rL2I1RHRGVWtXV3FjRlR6alRJVXU2MXJ1MlAzbUJ3NHFWVXE3WnREcGVsUURScks5TzhadXRtCk5IejZhNHVQVnltWitEQVhYYnB5Yi91QnhhM1NobGc5RjhmbkNidnhLL2VHM01IYWNWM1VSdVBNclNYQmlMeGcKWjNWbXMvRVk5NkpjNWxQL09vaTJSNlgvRXhqcW1BbDNQNTFUK2M4QjVmV21jQmNVcjJPay81bXprNTNjVTZjRwova2lGSGFGcHJpVjF1eFBNVWdQMTdWR2hpOXNWQWdNQkFBR2pnZ0VJTUlJQkJEQU9CZ05WSFE4QkFmOEVCQU1DCkFZWXdIUVlEVlIwbEJCWXdGQVlJS3dZQkJRVUhBd0lHQ0NzR0FRVUZCd01CTUJJR0ExVWRFd0VCL3dRSU1BWUIKQWY4Q0FRQXdIUVlEVlIwT0JCWUVGQlF1c3hlM1dGYkxybEFKUU9ZZnI1MkxGTUxHTUI4R0ExVWRJd1FZTUJhQQpGSG0wV2VaN3R1WGtBWE9BQ0lqSUdsajI2WnR1TURJR0NDc0dBUVVGQndFQkJDWXdKREFpQmdnckJnRUZCUWN3CkFvWVdhSFIwY0RvdkwzZ3hMbWt1YkdWdVkzSXViM0puTHpBbkJnTlZIUjhFSURBZU1CeWdHcUFZaGhab2RIUncKT2k4dmVERXVZeTVzWlc1amNpNXZjbWN2TUNJR0ExVWRJQVFiTUJrd0NBWUdaNEVNQVFJQk1BMEdDeXNHQVFRQgpndDhUQVFFQk1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQ0FRQ0Z5azVIUHFQM2hVU0Z2TlZuZUxLWVk2MTFUUjZXClBUTmxjbFF0Z2FEcXcrMzRJTDlmekxkd0FMZHVPL1plbE43a0lKK203NHV5QStlaXRSWThrYzYwN1RrQzUzd2wKaWtmbVpXNC9SdlRaOE02VUsrNVV6aEs4akNkTHVNR1lMNkt2elhHUlNnaTN5TGdqZXdRdENQa0lWejZEMlFRegpDa2NoZUFtQ0o4TXF5SnU1emx6eVpNakF2bm5BVDQ1dFJBeGVrcnN1OTRzUTRlZ2RSQ25iV1NEdFk3a2grQkltCmxKTlhvQjFsQk1FS0lxNFFEVU9Yb1JnZmZ1RGdoamUxV3JHOU1MK0hiaXNxL3lGT0d3WEQ5UmlYOEY2c3c2VzQKYXZBdXZEc3p1ZTVMM3N6ODVLK0VDNFkvd0ZWRE52Wm80VFlYYW82WjBmK2xRS2MwdDhEUVl6azFPWFZ1OHJwMgp5Sk1DNmFsTGJCZk9EQUxadllIN243ZG8xQVpsczRJOWQxUDRqbmtEclFveEIzVXFROWhWbDNMRUtRNzN4RjFPCnlLNUdoRERYOG9WZkdLRjV1K2RlY0lzSDRZYVR3N21QM0dGeEpTcXYzKzBsVUZKb2k1TGM1ZGExNDlwOTBJZHMKaENFeHJvTDErN21yeUlrWFBlRk01VGdPOXIwcnZaYUJGT3ZWMnowZ3AzNVowK0w0V1BsYnVFak4vbHhQRmluKwpIbFVqcjhnUnNJM3FmSk9RRnkvOXJLSUpSMFkvOE9td3QvOG9UV2d5MW1kZUhtbWprN2oxbllzdkM5SlNRNlp2Ck1sZGxUVEtCM3poVGhWMStYV1lwNnJqZDVKVzF6YlZXRWtMTnhFN0dKVGhFVUczc3pnQlZHUDdwU1dUVVRzcVgKbkxSYndIT29xN2hId2c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlGWURDQ0JFaWdBd0lCQWdJUVFBRjNJVGZVNlVLNDduYXFQR1FLdHpBTkJna3Foa2lHOXcwQkFRc0ZBREEvCk1TUXdJZ1lEVlFRS0V4dEVhV2RwZEdGc0lGTnBaMjVoZEhWeVpTQlVjblZ6ZENCRGJ5NHhGekFWQmdOVkJBTVQKRGtSVFZDQlNiMjkwSUVOQklGZ3pNQjRYRFRJeE1ERXlNREU1TVRRd00xb1hEVEkwTURrek1ERTRNVFF3TTFvdwpUekVMTUFrR0ExVUVCaE1DVlZNeEtUQW5CZ05WQkFvVElFbHVkR1Z5Ym1WMElGTmxZM1Z5YVhSNUlGSmxjMlZoCmNtTm9JRWR5YjNWd01SVXdFd1lEVlFRREV3eEpVMUpISUZKdmIzUWdXREV3Z2dJaU1BMEdDU3FHU0liM0RRRUIKQVFVQUE0SUNEd0F3Z2dJS0FvSUNBUUN0NkNSejlCUTM4NXVlSzFjb0hJZSszTGZmT0pDTWJqem1WNkI0OTNYQwpvdjcxYW03MkFFOG8yOTVvaG14RWs3YXhZLzBVRW11L0g5THFNWnNoZnRFelBMcEk5ZDE1MzdPNC94THhJWnBMCndZcUdjV2xLWm1ac2ozNDhjTCt0S1NJRzgrVEE1b0N1NGt1UHQ1bCtsQU9mMDBlWGZKbElJMVBvT0s1UENtK0QKTHRGSlY0eUFkTGJhTDlBNGpYc0RjQ0ViZGZJd1BQcVBydDNhWTZ2ckZrL0NqaEZMZnM4TDZQKzFkeTcwc250Swo0RXdTSlF4d2pRTXBvT0ZUSk93VDJlNFp2eEN6U293L2lhTmhVZDZzaHdlVTlHTng3QzdpYjF1WWdlR0pYRFI1CmJIYnZPNUJpZWViYnBKb3ZKc1hRRU9FTzN0a1FqaGI3dC9lbzk4ZmxBZ2VZanpZSWxlZmlONVlOTm5XZSt3NXkKc1IyYnZBUDVTUVhZZ2QwRnRDcldRZW1zQVhhVkNnL1kzOVc5RWg4MUx5Z1hiTktZd2FnSlpIZHVSemU2enF4WgpYbWlkZjNMV2ljVUdRU2srV1Q3ZEp2VWt5UkduV3FOTVFCOUdvWm0xcHpwUmJvWTdubjF5cHhJRmVGbnRQbEY0CkZRc0RqNDNRTHdXeVBudEtIRXR6QlJMOHh1cmdVQk44UTVOMHM4cDA1NDRmQVFqUU1OUmJjVGEwQjdyQk1EQmMKU0xlQ081aW1mV0NLb3FNcGdzeTZ2WU1FRzZLREEwR2gxZ1h4RzhLMjhLaDhoanRHcUVncWlOeDJtbmEvSDJxbApQUm1QNnpqelpON0lLdzBLS1AvMzIrSVZRdFFpMENkZDRYbitHT2R3aUsxTzV0bUxPc2JkSjFGdS83eGs5VE5EClR3SURBUUFCbzRJQlJqQ0NBVUl3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFPQmdOVkhROEJBZjhFQkFNQ0FRWXcKU3dZSUt3WUJCUVVIQVFFRVB6QTlNRHNHQ0NzR0FRVUZCekFDaGk5b2RIUndPaTh2WVhCd2N5NXBaR1Z1ZEhKMQpjM1F1WTI5dEwzSnZiM1J6TDJSemRISnZiM1JqWVhnekxuQTNZekFmQmdOVkhTTUVHREFXZ0JURXA3R2tleXh4Cit0dmhTNUIxLzhRVllJV0pFREJVQmdOVkhTQUVUVEJMTUFnR0JtZUJEQUVDQVRBL0Jnc3JCZ0VFQVlMZkV3RUIKQVRBd01DNEdDQ3NHQVFVRkJ3SUJGaUpvZEhSd09pOHZZM0J6TG5KdmIzUXRlREV1YkdWMGMyVnVZM0o1Y0hRdQpiM0puTUR3R0ExVWRId1ExTURNd01hQXZvQzJHSzJoMGRIQTZMeTlqY213dWFXUmxiblJ5ZFhOMExtTnZiUzlFClUxUlNUMDlVUTBGWU0wTlNUQzVqY213d0hRWURWUjBPQkJZRUZIbTBXZVo3dHVYa0FYT0FDSWpJR2xqMjZadHUKTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFBS2N3QnNsbTcvRGxMUXJ0Mk01MW9HclMrbzQ0Ky95UW9ERlZEQwo1V3hDdTIrYjlMUlB3a1NJQ0hYTTZ3ZWJGR0p1ZU43c0o3bzVYUFdpb1c1V2xIQVFVN0c3NUsvUW9zTXJBZFNXCjlNVWdOVFA1MkdFMjRIR050TGkxcW9KRmxjRHlxU01vNTlhaHkyY0kycUJETEtvYmt4L0ozdldyYVYwVDlWdUcKV0NMS1RWWGtjR2R0d2xmRlJqbEJ6NHBZZzFodG1mNVg2RFlPOEE0anF2MklsOURqWEE2VVNiVzFGelhTTHI5TwpoZThZNElXUzZ3WTdiQ2tqQ1dEY1JRSk1FaGc3NmZzTzN0eEUrRmlZcnVxOVJVV2hpRjFteXY0UTZXK0N5QkZDCkRmdnA3T09HQU42ZEVPTTQrcVI5c2Rqb1NZS0VCcHNyNkd0UEFRdzRkeTc1M2VjNQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==';
    let buff2 = Buffer.from(str2, 'base64');
    let key2 = buff2.toString('ascii');

    var options = {
      clean: true,
      connectTimeout: 4000,
      // Auth
      clientId: 'hcm_frontend',
      username: 'emqx_test',
      password: 'emqx_test',
      key: key1,
      cert: key2,
      rejectUnauthorized: true,
      protocol: 'mqtts',
    }
    var client = mqtt.connect(mqtt_url, options);

    client.on('connect', function () {
      client.subscribe('emqtt')
    })
    
    
    client.on('message', this.call_back)
    
    client.on('error', function (error) {
        console.log(error);
    });
    
    
    fetch(api_base_url + 'seniors/', {
        method: 'GET',
        headers: dashboardHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      for (var element of data['results']) {
        element["rri_data"] = [];
        element["temp_data"] = [];
        element["battery"] = 60;
        element["watch"] = false;
        element["active"] = false;
        element["color"] = randomColor({luminosity: 'dark',});
        this.OnlineSeniors.set(element['device_id'], element);
      }
      this.setState({flag: !this.state.flag});  // Triggers a re-rendering
    }).catch(err => {
      console.log(err)
    });

  };

  // function (topic, message) {
  //   const desData = ecg.ECGPacket.deserializeBinary(message).toObject();
  //   this.call_back();
  //   // const ecgObj = new ECGPacket()
  //   // const packet = schema.decodeECGPacket(message);
  //   console.log(desData)
  //   // this.setState({flag: !this.state.flag}); 
  // }
  call_back = (topic, message) => {
    const packet = ecg.ECGPacket.deserializeBinary(message).toObject();
    // console.log(packet)
    if(packet.command === ecg.ECGPacket.CommandType.NEW) {
        console.log("New device connected.", packet.deviceId);
        packet.active = true;
        this.OnlineSeniors.set(packet.deviceId, packet);
        this.OnlineSeniors[packet.deviceId].rri_data = new Array();
        this.OnlineSeniors[packet.deviceId].temp_data = new Array();

    } else if (packet.command === ecg.ECGPacket.CommandType.UPDATE) {
        if(this.OnlineSeniors.has(packet.deviceId)) {
          let new_data = {"value": packet.value, "time": packet.time};
          
          if(packet.dataType === ecg.ECGPacket.DataType.RRI) {
            this.OnlineSeniors.get(packet.deviceId).rri_data.push(new_data);
          } else if (packet.dataType === ecg.ECGPacket.DataType.TEMP) {
            this.OnlineSeniors.get(packet.deviceId).temp_data.push(new_data);
          }
          
          this.OnlineSeniors.get(packet.deviceId).data_type = packet.dataType === ecg.ECGPacket.DataType.RRI ? "RRI" : "TEMP";
          this.OnlineSeniors.get(packet.deviceId).active = true;
          this.OnlineSeniors.get(packet.deviceId).watch = exceeded_threshold(
              new_data.value,
              this.OnlineSeniors.get(packet.deviceId).date_type
          );
          // Maintain array size
          if(this.OnlineSeniors.get(packet.deviceId).rri_data.length > array_len_24h){
            this.OnlineSeniors.get(packet.deviceId).rri_data.shift();
          }
          if(this.OnlineSeniors.get(packet.deviceId).temp_data.length > array_len_24h){
            this.OnlineSeniors.get(packet.deviceId).temp_data.shift();
          }

        } else {
          console.log("Device not found", packet.deviceId);
        }

    } else if (packet.command === ecg.ECGPacket.CommandType.CLOSE) {
        packet.active = false;
        this.OnlineSeniors.get(packet.deviceId).active = false;
        console.log("Device offline", packet.deviceId);
        //this.OnlineSeniors.delete(packet.device_id);
    }
    
    // Triggers a re-rendering
    this.setState({flag: !this.state.flag}); 
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { user } = this.props.auth;
    const { collapsed } = this.state;
    return (
      <div>
        <script src="//cdn.rawgit.com/dcodeIO/protobuf.js/6.X.X/dist/protobuf.js"></script>
        <div className="dash-bgclolor">
        <Navbar className="dash-bgclolor">
          <Navbar.Brand className="text-light">Healthcare Monitor System</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="text-light">
              User: <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link onClick={this.onLogout} className="text-light">Logout</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        </div>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <div style={{height: 5}}> </div>
              <Menu.Item key="1" icon={<TeamOutlined />}>
                Online Users
              </Menu.Item>
              {/* <Menu.Item key="2" icon={<SearchOutlined />}>
                Search
              </Menu.Item> */}
            </Menu>
          </Sider>

          <Layout className="site-layout">
            <Content style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <UserList
                  online_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === false && data.active === true)}
                  watch_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === true && data.active === true)}
                  inactive_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.active === false)}
                />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>NE Lab ©2022 Umass Amherst</Footer>
          </Layout>
        </Layout>
        
      </div>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  logout
})(withRouter(Dashboard));