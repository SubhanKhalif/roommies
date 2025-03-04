import React from 'react';
import { MotionAnimate } from 'react-motion-animate';
import { NavLink } from 'react-router-dom';
import {
  ForumOutlined as ForumIcon,
  SearchOutlined as SearchIcon,
  Info as InfoIcon,
  SettingsOutlined as SettingsIcon,
  PersonSearchOutlined as PersonSearchIcon,
  PostAddOutlined as PostAddIcon
} from '@mui/icons-material';

const iconComponents = [
  <ForumIcon key="forum" />,
  <SearchIcon key="search" />,
  <InfoIcon key="info" />,
  <SettingsIcon key="settings" />,
  <PersonSearchIcon key="person-search" />,
  <PostAddIcon key="post-add" />
];

const Item = ({ text, to, val }) => {
  const navLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? '#0147FF' : '',
    color: isActive ? 'white' : ''
  });

  return (
    <MotionAnimate reset>
      <NavLink
        to={to}
        style={navLinkStyle}
        className="w-[80%] max-[1250px]:text-sm max-[1024px]:my-4 max-[1024px]:justify-center max-[1024px]:items-center max-[1024px]:py-[6%] transition ease-in-out delay-250 flex flex-row px-[6%] py-[3%] rounded-lg my-[10%]"
      >
        {iconComponents[val]}
        <div className="max-[1024px]:hidden ml-[12%]">{text}</div>
      </NavLink>
    </MotionAnimate>
  );
};

export default Item;