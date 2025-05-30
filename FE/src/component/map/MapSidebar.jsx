import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapApi from '../../api/mapApi';

export default function MapSidebar({
  houseId,
  maplists,
  setMapLists,
  setAddressData,
  setNickName,
}) {
  const { movingPlanId } = useParams();

  const [housedetails, setHouseDetails] = useState('');

  const [mapselect, setMapSelect] = useState(false);

  const [isnicknameEditing, setNickNameIsEditing] = useState(false);

  const [isaddressEditing, setAddressIsEditing] = useState(false);

  const { nickname, address1, address2, content, id } = housedetails;

  const [nicknameError, setNicknameError] = useState('');

  const [addressError, setAddressError] = useState('');

  const mapSidebar = 'w-full h-full flex flex-col justify-center flex-1 pl-4 gap-2';
  const houseDelete = 'text-gray-500 text-opacity-70 underline cursor-pointer hover:text-primary';
  const updateStyle =
    'text-gray-500 text-opacity-70 underline cursor-pointer hover:text-primary inline ml-4';
  const textareaStyle =
    'w-full h-full p-6 border-2 rounded-2xl border-black resize-none focus:outline-none';
  const nicknameupdateStyle =
    'w-40 text-xl text-black font-semibold border-b-[1px] border-black outline-none px-1 inline-block';
  const addressupdateStyle =
    'w-90 text-black border-b-[1px] border-black outline-none inline-block';

  useEffect(() => {
    async function fetchHouseDetail() {
      if (!houseId) return;

      try {
        const response = await mapApi.housedetail(movingPlanId, houseId);

        setHouseDetails(response.data.data);
        setMapSelect(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchHouseDetail();
  }, [houseId, id]);

  const housedelete = async (e) => {
    try {
      const { id } = e.target;

      await mapApi.housedelete(movingPlanId, id);
      setMapLists(maplists.filter((maplist) => maplist.id != id));

      setAddressData((prev) => ({
        ...prev,
        centerlatitude: null,
        centerlongitude: null,
      }));
      setMapSelect(false);
    } catch (err) {
      console.log(err);
    }
  };

  const contentChange = (e) => {
    setHouseDetails((prev) => ({ ...prev, content: e.target.value }));
  };

  const contentUpdate = async (e) => {
    try {
      const { id } = e.target;

      await mapApi.contentupdate(movingPlanId, id, { content });
    } catch (err) {
      console.log(err);
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e) => {
    setHouseDetails((prev) => ({ ...prev, nickname: e.target.value }));
  };

  // 닉네임 업데이트
  const updateNickname = async (e) => {
    if (!nickname.trim()) {
      setNicknameError('별명을 넣어주세요.');
      return;
    }

    try {
      const { id } = e.target;
      await mapApi.nicknameupdate(movingPlanId, id, { nickname });
      setNickName(nickname);
      setNicknameError('');
    } catch (err) {
      console.log(err);
    }
    setNickNameIsEditing(false);
  };

  // 상세주소 변경 핸들러
  const handleAddressChange = (e) => {
    setHouseDetails((prev) => ({ ...prev, address2: e.target.value }));
  };

  // 상세주소 업데이트
  const updateAddress = async (e) => {
    if (!address2.trim()) {
      setAddressError('상세 주소를 넣어주세요.');
      return;
    }

    try {
      const { id } = e.target;

      await mapApi.addressupdate(movingPlanId, id, { address2 });
      setAddressError('');
    } catch (err) {
      console.log(err);
    }
    setAddressIsEditing(false);
  };

    // 엔터키 눌러 별칭 수정
    const handleAdressEnter = (e) => {
      if (e.key === 'Enter') {
        updateAddress(e);
      }
    };

     // 엔터키 눌러 주소 수정
     const handleNicknameEnter = (e) => {
      if (e.key === 'Enter') {
        updateNickname(e);
      }
    };

  return (
    <section className={mapSidebar}>
      {!mapselect || maplists.length == 0 ? (
        <div className="flex justify-center text-2xl">
          <div>집을 선택하세요</div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-5">
            <div className={houseDelete} onClick={housedelete} id={id}>
              집 삭제
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              {isnicknameEditing ? (
                <div>
                  <input
                    type="text"
                    className={nicknameupdateStyle}
                    id={id}
                    maxLength="5"
                    value={nickname}
                    onChange={handleNicknameChange}
                    onBlur={updateNickname}
                    onKeyDown={handleNicknameEnter}
                    autoFocus
                  />
                  {nicknameError && (
                    <div className="text-red-500 text-sm mt-1">{nicknameError}</div>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="text-xl text-black font-semibold">{nickname}</h2>
                  <div className={updateStyle} onClick={() => setNickNameIsEditing(true)}>
                    수정
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="mb-2">{address1}</div>
              <div className="flex ">
                {isaddressEditing ? (
                  <div className='mb-5'>
                    <input
                      type="text"
                      className={addressupdateStyle}
                      id={id}
                      maxLength="35"
                      value={address2}
                      onChange={handleAddressChange}
                      onBlur={updateAddress}
                      onKeyDown={handleAdressEnter}
                      autoFocus
                    />
                    {addressError && (
                      <div className="text-red-500 text-sm mt-1">{addressError}</div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="max-w-90 mb-5">
                      {address2}
                      <div className={updateStyle} onClick={() => setAddressIsEditing(true)}>
                        수정
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-full flex justify-center">
            <textarea
              className={textareaStyle}
              value={content || ''}
              id={id}
              onChange={contentChange}
              onBlur={contentUpdate}
            ></textarea>
          </div>
        </>
      )}
    </section>
  );
}
