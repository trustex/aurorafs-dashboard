import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, Input, message } from 'antd';
import { Event } from 'electron';
import { throttle } from '@/utils/util';
import { isElectron } from '@/config/version';

const { TextArea } = Input;
let ipcRenderer: any = null;
if (isElectron) {
  ipcRenderer = window.require('electron').ipcRenderer;
}

const AuroraConfigEdit: React.FC = () => {
  const [auroraConfig, setAuroraConfig] = useState('');
  useEffect(() => {
    ipcRenderer.on('config', (event: Event, data: any) => {
      if (data.err) {
        message.info(data.err);
      } else {
        setAuroraConfig(data.data);
      }
    });
    ipcRenderer.send('config');
    ipcRenderer.on('save', (event: Event, data: any) => {
      if (data.err) {
        message.info(data.err);
      } else {
        message.success('Your changes have been saved');
      }
    });
    ipcRenderer.on('reset', (event: Event, data: any) => {
      if (data.err) {
        message.info('Reset failed');
      } else {
        setAuroraConfig(data.data);
        message.success('Reset successfully');
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('config');
      ipcRenderer.removeAllListeners('save');
      ipcRenderer.removeAllListeners('reset');
    };
  }, []);
  const saveHandle = (): void => {
    if (!auroraConfig) {
      message.info('Configuration is empty');
    } else {
      ipcRenderer.send('save', auroraConfig);
    }
  };
  const resetHandle = () => {
    ipcRenderer.send('reset');
  };
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1 className={styles.title}>Aurora Config</h1>
        <div className={styles.func}>
          <span>
            The config file is read once when the Aurora is started. Save your
            changes, then restart the Aurora to apply them.
          </span>
          <div>
            <Button
              className={styles.btn}
              onClick={throttle(resetHandle, 1000)}
            >
              Reset
            </Button>
            <Button
              className={styles.btn}
              onClick={throttle(saveHandle, 1000)}
              id={'saveAuroraConfig'}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <TextArea
        autoSize={true}
        bordered={false}
        className={styles.text}
        id={'auroraConfig'}
        value={auroraConfig}
        onChange={(e) => setAuroraConfig(e.target.value)}
      />
    </div>
  );
};

export default AuroraConfigEdit;
