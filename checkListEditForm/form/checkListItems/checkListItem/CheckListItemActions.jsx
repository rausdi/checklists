import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import CheckListItemAction from 'pages/checkListEditForm/form/checkListItems/checkListItem/checkListItemActions/CheckListItemAction';
import DeleteMarker from 'components/SVGIcons/DeleteMarker';
import Copy from 'components/SVGIcons/Copy';
import ArrowUp from 'components/SVGIcons/ArrowUp';
import ArrowDown from 'components/SVGIcons/ArrowDown';

const CheckListItemActionsRoot = styled.div({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    top: 0,
    right: 0,
    zIndex: 1,
});

function CheckListItemActions(props) {
    const {
        deleteCheckListItem,
        copyCheckListItem,
        liftUpCheckListItem,
        dropDownCheckListItem,
    } = props;
    return (
        <CheckListItemActionsRoot>
            <CheckListItemAction icon={<Copy />} onClick={copyCheckListItem} />
            <CheckListItemAction
                icon={<DeleteMarker />}
                onClick={deleteCheckListItem}
                marginRight
            />
            <CheckListItemAction icon={<ArrowUp />} onClick={liftUpCheckListItem} />
            <CheckListItemAction
                icon={<ArrowDown />}
                onClick={dropDownCheckListItem}
                topRightRadius
            />
        </CheckListItemActionsRoot>
    );
}

CheckListItemActions.propTypes = {
    deleteCheckListItem: PropTypes.func,
    copyCheckListItem: PropTypes.func,
    liftUpCheckListItem: PropTypes.func,
    dropDownCheckListItem: PropTypes.func,
};

export default CheckListItemActions;
