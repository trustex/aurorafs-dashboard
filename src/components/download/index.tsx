import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import styles from './index.less';
import { useDispatch, useSelector } from 'umi';
import { Models } from '@/declare/modelType';
import Api from '@/api/api';
import { stringToBinary } from '@/utils/util';

const Download: React.FC = () => {
  let dispatch = useDispatch();
  const [hash, setHash] = useState('');
  const { api } = useSelector((state: Models) => state.global);
  const { filesList, downloadList } = useSelector((state: Models) => state.files);

  const download = (hashValue: string): void => {
    window.open(api + '/files/' + hashValue);
    if (filesList.findIndex(item => item.fileHash === hashValue) === -1) {
      dispatch({
        type: 'files/addDLHash',
        payload: {
          hash: hashValue,
        },
      });
    }
    setHash('');
  };
  return <div className={styles.downloadFile}>
    <div style={{ flex: 1 }}>
      <Input placeholder={'Enter file hash'} value={hash} onChange={(e) => {
        setHash(e.currentTarget.value);
      }} />
    </div>
    <Button
      type='primary'
      onClick={() => {
        download(hash);
      }}
      className={styles.download}
      disabled={!hash || hash.length !== 64}
    >
      download
    </Button>
  </div>;
};

export default Download;
