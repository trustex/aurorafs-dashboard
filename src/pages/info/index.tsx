import React, { useEffect } from 'react';
import NotConnected from '@/components/notConnected';
import { useDispatch, useSelector } from 'umi';
import { Models } from '@/declare/modelType';
import Card from '@/components/card';
import styles from './index.less';
import { time } from '@/config/url';

const Main: React.FC = () => {
  const dispatch = useDispatch();
  const { debugApi, version, topology } = useSelector((state: Models) => state.global);
  const { addresses } = useSelector((state: Models) => state.info);
  const getTopology = () => {
    dispatch({
      type: 'global/getTopology',
      payload: {
        url: debugApi,
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'info/getAddresses',
      payload: {
        url: debugApi,
      },
    });
    getTopology();
    let timer = setInterval(getTopology, time);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <>
    <div style={{ display: 'flex',flexDirection:'column' }}>
      <div className={styles.topology}>
        <Card title={'Connected Peers'} text={topology?.connected || 0}
              style={{ minWidth: 525, marginRight: 50, marginBottom: 30 }} />
        <Card title={'Discovered Peers'} text={topology?.population || 0} style={{ minWidth: 525, marginBottom: 30 }} />
      </div>
      <div className={styles.address}>
        <p>AGENT VERSION:&nbsp;&nbsp;{version}</p>
        <p>PUBLIC KEY:&nbsp;&nbsp;{addresses?.public_key} </p>
        <p>OVERLAY ADDRESS(PEER ID):&nbsp;&nbsp;{addresses?.overlay}</p>
        <div style={{ margin: '40px 0 10px 0' }}>UNDERLAY ADDRESS</div>
        <ul className={styles.underlay}>
          {
            addresses?.underlay?.map((item, index) => {
              return <li className={styles.underlayList} key={index}>{item}</li>;
            })
          }
        </ul>
      </div>
    </div>
  </>;
};

const Info: React.FC = (props) => {
  const { status } = useSelector((state: Models) => state.global);
  return (
    <>
      {
        status ?
          <Main />
          :
          <NotConnected />
      }
    </>
  );
};

export default Info;
