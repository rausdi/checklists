import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import { COLORS_NEW, COLORS } from 'components/theme';

const Icon = styled.div({
    display: 'flex',
    width: 10,
});

const CheckListItemActionRoot = styled.div(
    {
        display: 'flex',
        padding: 8,
        borderLeft: `1px solid ${COLORS_NEW.BORDER.GRAY_3}`,
        borderBottom: `1px solid ${COLORS_NEW.BORDER.GRAY_3}`,
        background: COLORS_NEW.GENERAL.WHITE,
        '&:hover': {
            cursor: 'pointer',
            [Icon]: {
                '>svg': {
                    '>path': {
                        fill: COLORS.ICON.BLUE,
                    },
                    '>rect': {
                        fill: COLORS.ICON.BLUE,
                    },
                },
            },
        },
    },
    ({ marginRight, topRightRadius }) => ({
        marginRight: marginRight ? 20 : 0,
        borderTopRightRadius: topRightRadius ? 5 : 0,
        borderRight: topRightRadius ? 'none' : `1px solid ${COLORS_NEW.BORDER.GRAY_3}`,
    }),
);

function CheckListItemAction(props) {
    const { icon, onClick, marginRight, topRightRadius } = props;
    return (
        <CheckListItemActionRoot
            onClick={onClick}
            marginRight={marginRight}
            topRightRadius={topRightRadius}
        >
            <Icon>{icon}</Icon>
        </CheckListItemActionRoot>
    );
}

CheckListItemAction.propTypes = {
    icon: PropTypes.node,
    onClick: PropTypes.func,
    marginRight: PropTypes.bool,
    topRightRadius: PropTypes.bool,
};

export default CheckListItemAction;
