import styled from 'styled-components'
import {Radio, Slider, Checkbox } from '@material-ui/core'
import { Pagination } from '@material-ui/lab';
import {grey, red} from '@material-ui/core/colors'
import {withStyles} from '@material-ui/core/styles'
import PaginationItem from '@material-ui/lab/PaginationItem';

export const WhiteRadio = styled(Radio)`
  color: ${grey[50]};
  &.Mui-checked {
    color: ${red[800]};
  }
`;

export const CustomSlider = withStyles({
    root: {
        color: "firebrick",
        height: 3,
        padding: "13px 0",
    },
    track: {
        height: 4,
        borderRadius: 22,
    },
    rail: {
        color:'white'
    },
    markLabel: {
        color:'white'
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: "firebrick",
        border: "1px solid firebrick",
        marginTop: -9,
        marginLeft: -11,
        color: "#fff",
    },
})(Slider);

export const CustomCheckbox = withStyles({
    root: {
      color: '#f50057',
      '&$checked': {
        color: 'firebrick',
      }
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const StyledPagination = withStyles({
    root:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    ul:
    {
        textAlign: 'center',
        backgroundColor: 'black'
    }
})(Pagination);

export const StyledPaginationItem = withStyles({
    root:
    {
        color: 'white'
    },
    page:
    {
        '&.Mui-selected': {
            backgroundColor: 'firebrick',
            '&:hover': {
                backgroundColor: 'gray'
            }
        },
        '&:hover': {
            backgroundColor: 'gray'
        }
    }
})(PaginationItem);
