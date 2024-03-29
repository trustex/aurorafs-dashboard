import React from 'react';
import styles from './index.less';
// type
import {OnChange} from '@/declare/event';

export type Props = {
  value:string,
  title?: string,
  tip?: string,
  fn: (value: string) => void
}
const SettingApi: React.FC<Props> = (props) => {
  const tip = 'Enter node host override / port';
  const change:OnChange = (e) => {
    props.fn(e.target.value)
  }
  return <>
    <div className={styles.settingApi}>
      <div>
        <span>{props.title}</span>
      </div>
      <div className={styles.input}>
        <input value={props.value} onChange={change}/>
      </div>
      <div>
        <span>( {props.tip || tip} )</span>
      </div>
    </div>
  </>;
};

export default SettingApi;
