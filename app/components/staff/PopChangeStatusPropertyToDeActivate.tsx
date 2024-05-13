import React from 'react';
import { Button, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from '@/app/libs/axios';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import useMaintanceResortModal from '@/app/hooks/useMaintanceResortModal';

interface PopChangeStatusPropertyToDeActivateProps {
  fetchProperties: () => void;
  id: number;
}

const PopChangeStatusPropertyToDeActivate: React.FC<PopChangeStatusPropertyToDeActivateProps> = ({
  id,
  fetchProperties,
}) => {
  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    let data = JSON.stringify('DEACTIVATE');
    return new Promise((resolve) => {
      //setTimeout(() => resolve(null), 3000);
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://holiday-swap.click/api/v1/properties/${id}/status`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          message.success('Change status success.');
          resolve(null);
          fetchProperties();
        })
        .catch((error) => {
          message.error(`Change status failed. \n ${error}`);
          resolve(null);
          console.log(error);
        });
    });
  };

  const deactiveResortModal = useDeactiveResortModal();
  const maintanceResortModal = useMaintanceResortModal();

  return (
    <div className="flex flex-col gap-1">
      <Button
        danger
        onClick={() => {
          deactiveResortModal.onOpen(id.toString(), 'DEACTIVATE');
          deactiveResortModal.onDeactiveProperty();
        }}
      >
        Deactive
      </Button>

      <Button
        className="border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600"
        onClick={() => {
          maintanceResortModal.onOpen(id.toString(), 'MAINTENANCE');
          maintanceResortModal.onMaintanceProperty();
        }}
      >
        Maintance
      </Button>
    </div>
  );
};

export default PopChangeStatusPropertyToDeActivate;
