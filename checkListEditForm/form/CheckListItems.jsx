import React, { Component } from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import ShadowBlock from 'components/ShadowBlock';
import Text from 'components/Text';
import { FONT, COLORS } from 'components/theme';
import CheckListItem from 'pages/checkListEditForm/form/checkListItems/CheckListItem';
import DeleteIcon from 'components/SVGIcons/DeleteMarker';
import Button from 'components/Button';
import Add from 'components/SVGIcons/AddNew';

const MainRoot = styled(ShadowBlock)({
    flexDirection: 'column',
    padding: '28px 22px',
    background: COLORS.COMMON.WHITE,
});

const Title = styled(Text)({
    fontWeight: FONT.WEIGHT.BOLD,
});

const TitleWrap = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
});

const AddCheckListItemButton = styled.div({});

class CheckListItems extends Component {
    addCheckListItem = () => {
        const { fields } = this.props;
        fields.push({
            checkListItemName: '',
            checkListItemDescription: '',
            checkListItemAttribute: null,
        });
    };

    deleteCheckListItem = index => () => {
        const { fields } = this.props;
        fields.remove(index);
    };

    copyCheckListItem = index => () => {
        const { fields } = this.props;
        const { id, ...checkListItem } = fields.get(index);
        fields.insert(index + 1, checkListItem);
    };

    liftUpCheckListItem = index => () => {
        const { fields } = this.props;
        if (index - 1 >= 0) {
            fields.swap(index, index - 1);
        }
    };

    dropDownCheckListItem = index => () => {
        const { fields } = this.props;
        if (index + 1 < fields.length) {
            fields.swap(index, index + 1);
        }
    };

    render() {
        const { title, t, fields, meta } = this.props;
        return (
            <MainRoot>
                <TitleWrap>
                    <Title>{title}</Title>
                    {fields.length > 0 && (
                        <Button
                            text={t('clearCheckListItems')}
                            iconLeft={<DeleteIcon />}
                            type={'white'}
                            size={'s'}
                            onClick={fields.removeAll}
                        />
                    )}
                </TitleWrap>
                {fields.map((checkListItem, index) => (
                    <CheckListItem
                        key={index}
                        checkListItem={checkListItem}
                        t={t}
                        deleteCheckListItem={this.deleteCheckListItem(index)}
                        copyCheckListItem={this.copyCheckListItem(index)}
                        liftUpCheckListItem={this.liftUpCheckListItem(index)}
                        dropDownCheckListItem={this.dropDownCheckListItem(index)}
                    />
                ))}
                <AddCheckListItemButton>
                    <Button
                        text={t('addCheckListItem')}
                        onClick={this.addCheckListItem}
                        type={'bordered'}
                        iconLeft={<Add />}
                        size={'s'}
                    />
                </AddCheckListItemButton>
            </MainRoot>
        );
    }
}

CheckListItems.propTypes = {
    title: PropTypes.string,
    t: PropTypes.func,
    fields: PropTypes.object,
    meta: PropTypes.object,
};

export default CheckListItems;
