export const functionsText = `
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * 'interfaceId'. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}



//import “openzeppelin-solidity/contracts/access/Ownable.sol”;
//import “openzeppelin-solidity/contracts/math/SafeMath.sol”;
//import “openzeppelin-solidity/contracts/token/ERC20/IERC20.sol”;






/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when 'tokenId' token is transferred from 'from' to 'to'.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when 'owner' enables 'approved' to manage the 'tokenId' token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when 'owner' enables or disables ('approved') 'operator' to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ''owner'''s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the 'tokenId' token.
     *
     * Requirements:
     *
     * - 'tokenId' must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers 'tokenId' token from 'from' to 'to', checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - 'from' cannot be the zero address.
     * - 'to' cannot be the zero address.
     * - 'tokenId' token must exist and be owned by 'from'.
     * - If the caller is not 'from', it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If 'to' refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers 'tokenId' token from 'from' to 'to'.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - 'from' cannot be the zero address.
     * - 'to' cannot be the zero address.
     * - 'tokenId' token must be owned by 'from'.
     * - If the caller is not 'from', it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to 'to' to transfer 'tokenId' token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - 'tokenId' must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for 'tokenId' token.
     *
     * Requirements:
     *
     * - 'tokenId' must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove 'operator' as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The 'operator' cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the 'operator' is allowed to manage all of the assets of 'owner'.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
      * @dev Safely transfers 'tokenId' token from 'from' to 'to'.
      *
      * Requirements:
      *
     * - 'from' cannot be the zero address.
     * - 'to' cannot be the zero address.
      * - 'tokenId' token must exist and be owned by 'from'.
      * - If the caller is not 'from', it must be approved to move this token by either {approve} or {setApprovalForAll}.
      * - If 'to' refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
      *
      * Emits a {Transfer} event.
      */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}

//import "https://github.com/OpenZeppelin/openzeppelin-contra cts/blob/master/contracts/token/ERC721/IERC721.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";




/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * 'SafeMath' restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's '+' operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's '-' operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's '-' operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's '*' operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's '/' operator. Note: this function uses a
     * 'revert' opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's '/' operator. Note: this function uses a
     * 'revert' opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's '%' operator. This function uses a 'revert'
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's '%' operator. This function uses a 'revert'
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}




/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by 'account'.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves 'amount' tokens from the caller's account to 'recipient'.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that 'spender' will be
     * allowed to spend on behalf of 'owner' through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets 'amount' as the allowance of 'spender' over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves 'amount' tokens from 'sender' to 'recipient' using the
     * allowance mechanism. 'amount' is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when 'value' tokens are moved from one account ('from') to
     * another ('to').
     *
     * Note that 'value' may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a 'spender' for an 'owner' is set by
     * a call to {approve}. 'value' is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}




/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}









/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * 'onlyOwner', which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * 'onlyOwner' functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account ('newOwner').
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}











/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning 'false' on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20 {
    using SafeMath for uint256;

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Sets the values for {name} and {symbol}, initializes {decimals} with
     * a default value of 18.
     *
     * To select a different value for {decimals}, use {_setupDecimals}.
     *
     * All three of these values are immutable: they can only be set once during
     * construction.
     */
    constructor (string memory name_, string memory symbol_) public {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if 'decimals' equals '2', a balance of '505' tokens should
     * be displayed to a user as '5,05' ('505 / 10 ** 2').
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless {_setupDecimals} is
     * called.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - 'recipient' cannot be the zero address.
     * - the caller must have a balance of at least 'amount'.
     */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - 'spender' cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - 'sender' and 'recipient' cannot be the zero address.
     * - 'sender' must have a balance of at least 'amount'.
     * - the caller must have allowance for ''sender'''s tokens of at least
     * 'amount'.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to 'spender' by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - 'spender' cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to 'spender' by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - 'spender' cannot be the zero address.
     * - 'spender' must have allowance for the caller of at least
     * 'subtractedValue'.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    /**
     * @dev Moves tokens 'amount' from 'sender' to 'recipient'.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - 'sender' cannot be the zero address.
     * - 'recipient' cannot be the zero address.
     * - 'sender' must have a balance of at least 'amount'.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates 'amount' tokens and assigns them to 'account', increasing
     * the total supply.
     *
     * Emits a {Transfer} event with 'from' set to the zero address.
     *
     * Requirements:
     *
     * - 'to' cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys 'amount' tokens from 'account', reducing the
     * total supply.
     *
     * Emits a {Transfer} event with 'to' set to the zero address.
     *
     * Requirements:
     *
     * - 'account' cannot be the zero address.
     * - 'account' must have at least 'amount' tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Sets 'amount' as the allowance of 'spender' over the 'owner' s tokens.
     *
     * This internal function is equivalent to 'approve', and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - 'owner' cannot be the zero address.
     * - 'spender' cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Sets {decimals} to a value other than the default one of 18.
     *
     * WARNING: This function should only be called from the constructor. Most
     * applications that interact with token contracts will not expect
     * {decimals} to ever change, and may work incorrectly if it does.
     */
    function _setupDecimals(uint8 decimals_) internal {
        _decimals = decimals_;
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when 'from' and 'to' are both non-zero, 'amount' of ''from'''s tokens
     * will be to transferred to 'to'.
     * - when 'from' is zero, 'amount' tokens will be minted for 'to'.
     * - when 'to' is zero, 'amount' of ''from'''s tokens will be burned.
     * - 'from' and 'to' are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
}


//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/GSN/Context.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract CSOVToken is ERC20, Ownable {
    using SafeMath for uint256;

    string private constant NAME = "CSOVrynToken"; // Token Name
    string private constant SYMBOL = "CSOV"; // Token Symbol

    bool public isSaleEnded;
    address payable saleAdmin;
    bool public isSaleAdminsUpdate;

    /**
     *
     * All three of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(uint256 totalSupply_, address payable _csovAdmin)
        public
        ERC20(NAME, SYMBOL)
    {
        transferOwnership(_csovAdmin);
        _mint(_csovAdmin, totalSupply_);
    }

    function saleClosure(bool _isSaleEnded) public {
        require(msg.sender == saleAdmin, "Only saleAdmin can close the sale");
        if (!isSaleEnded) {
            isSaleEnded = _isSaleEnded;
        }
    }

    function setSaleAdmin(address payable _saleAdmin) external onlyOwner {
        saleAdmin = _saleAdmin;
        isSaleAdminsUpdate = true;
        require(
            transfer(saleAdmin, balanceOf(owner())),
            "saleAdmin token transer failed"
        );
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - 'recipient' cannot be the zero address.
     * - the caller must have a balance of at least 'amount'.
     */
    function transfer(address to, uint256 value)
        public
        override
        returns (bool)
    {
        if(onlyAllowed(msg.sender)){
            return super.transfer(to, value);
        }
        return false;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        if(onlyAllowed(sender)){
            return super.transferFrom(sender, recipient, amount);
        }
        return false;
    }

    function onlyAllowed(address adminAllowed) internal returns (bool)  {
        require(
            isSaleEnded || adminAllowed == owner() || adminAllowed == saleAdmin,
            "Token Transfer is not allowed during the sale"
        );
        return true;
    }
}





contract CrowdSale is Ownable {
    using SafeMath for uint256;

    // the sum of all deposits per investor
    mapping(address => uint256) public InvestorTotalDeposits;
    mapping(address => uint256) public MaxDepositPerNFT;
    /** Admin wallets allowed to assign tokens to BTC investors*/
    mapping(address => bool) public isAdmin;
    address public token;
    address[] public NFTAddresses;
    address payable public sovrynAddress;
    uint256 public end;
    // How many token units a buyer gets per wei
    uint256 public rate;
    // Amount of wei raised
    uint256 public weiRaised;
    uint256 public crowdSaleSupply;
    uint256 public availableTokens;
    uint256 public tokenTotalSupply;
    uint256 public minPurchase;
    //uint256 public maxPurchase;
    bool public saleEnded;
    bool public isStopSale;

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(
        address indexed purchaser,
        uint256 value,
        uint256 amount
    );
    event Imburse(address payable indexed imbursePurchaser, uint256 amount);
    event CrowdSaleStarted(uint256 total, uint256 sale, uint256 minp);

    /**
     ** maxDepositList[] - array of maxDeposit of RBTC (in wei) per NFT. maxDepositList[i] > maxDepositList[i+1]
     ** NFTAddresses [] - array of NFT's deployed contracts addresses
     **/
    constructor(
        address _CSOVAddress,
        address[] memory _NFTAddresses,
        uint256[] memory _maxDepositList,
        address payable _sovrynAddress
    ) public payable {
        token = _CSOVAddress;
        NFTAddresses = _NFTAddresses;
        sovrynAddress = _sovrynAddress;
        tokenTotalSupply = CSOVToken(token).totalSupply();

        for (uint256 i = 0; i < NFTAddresses.length; i++) {
            MaxDepositPerNFT[NFTAddresses[i]] = _maxDepositList[i];
            if (i < (NFTAddresses.length - 1)) {
                require(
                    _maxDepositList[i] > _maxDepositList[i + 1],
                    "maxDepositList[] must be in order: maxDepositList[i] > maxDepositList[i+1]"
                );
            }
        }
    }

    /**
     * @dev   Owner starts the crowdsale
     * @param _duration - Duration of the sale
     * @param _rate - Number of token units a buyer gets per wei
     * @param _minPurchase - Minimum deposit required
     * @param _crowdSaleSupply - Max number of tokens for the sale
     */
    function start(
        uint256 _duration,
        uint256 _rate,
        uint256 _minPurchase,
        uint256 _crowdSaleSupply
    ) external onlyOwner saleNotActive {
        CSOVToken tokenInstance = CSOVToken(token);
        require(
            tokenInstance.isSaleAdminsUpdate(),
            "Need to call setSaleAdmin on CSOVToken before start"
        );
        crowdSaleSupply = _crowdSaleSupply;
        require(0 < _minPurchase, "_minPurchase should be > 0");
        require(
            _minPurchase < crowdSaleSupply,
            "_minPurchase should be < crowdSaleSupply"
        );
        require(
            crowdSaleSupply <= tokenTotalSupply,
            "crowdSaleSupply should be <= totalSupply"
        );
        require(_duration > 0, "_duration should be > 0");
        availableTokens = crowdSaleSupply;
        end = _duration.add(block.timestamp);
        rate = _rate;
        minPurchase = _minPurchase;
        emit CrowdSaleStarted(tokenTotalSupply, crowdSaleSupply, minPurchase);
    }

    /**
     * @dev   Deposit Funds and receive tokens
     * @dev   This function first check the RBTC deposit requirements and then the token availablility
     * @dev   Reimburse in 2 cases:
     * @dev   A.Investor sends more than his maxPurchase amount
     * @dev    (Can-not a must- happen to each investor only once)
     * @dev   B.Not enough available coins left for the sale
     * @dev    (Can happen only once during the sale, since sale will be closed once availbleTokens == 0)
     */
    function buy() external payable saleActive {
        // Check Deposit RBTC deposit for requirements ==> depositAllowed
        require(
            msg.value >= minPurchase,
            "must send more then global minPurchase"
        );

        // maxPurchase is the max purchase allowed based on NFT Holding
        uint256 maxPurchase = getMaxPurchase(msg.sender);
        require(maxPurchase > 0, "The User does NOT hold NFT");

        // depositAllowed is the allowed deposit after sub of former deposits by the same investor
        uint256 depositAllowed =
            maxPurchase.sub(InvestorTotalDeposits[msg.sender]);
        maxPurchase = 0;
        require(
            depositAllowed != 0,
            "Investor deposits have reached maxPurchase amount"
        );
        // Check Token availability
        // cannot sell more than availble tokens left for the sale
        uint256 tokenQuantityAllowed = getTokenAmount(depositAllowed);
        if (tokenQuantityAllowed > availableTokens) {
            tokenQuantityAllowed = availableTokens;
        }

        // The token amount the investor wish to buy
        uint256 tokenQuantityRequest = getTokenAmount(msg.value);

        // ReimburseRBTC > 0 if tokenRequest > tokenAllowed
        uint256 reimburseRBTC;
        if (tokenQuantityRequest > tokenQuantityAllowed) {
            reimburseRBTC = (tokenQuantityRequest.sub(tokenQuantityAllowed))
                .div(rate);
            tokenQuantityRequest = tokenQuantityAllowed;
        }

        uint256 RBTCDepositRequest = (msg.value).sub(reimburseRBTC);
        _processPurchase(msg.sender, RBTCDepositRequest, tokenQuantityRequest);

        //Transfer RBTC deposit to governorVault SC
        sovrynAddress.transfer(RBTCDepositRequest);

        // Refund RBTC
        if (reimburseRBTC > 0) {
            msg.sender.transfer(reimburseRBTC);
            emit Imburse(msg.sender, reimburseRBTC);
        }
    }

    /**
     * @notice assigns token to a BTC investor
     * @dev only callable by the admins
     * @param _investor the address of the BTC investor
     * @param _amountWei the amount of BTC transfered with 18 decimals
     * */
    function assignTokens(address _investor, uint256 _amountWei)
        external
        onlyAdmin
        saleActive
    {
        //no partial investments for btc investors to keep our accounting simple
        uint256 maxPurchase = getMaxPurchase(_investor);
        require(
            maxPurchase >= _amountWei.add(InvestorTotalDeposits[_investor]),
            "investor already has too many tokens"
        );
        uint256 numTokens = getTokenAmount(_amountWei);
        require(
            numTokens <= availableTokens,
            "amount needs to be smaller than the number of available tokens"
        );
        _processPurchase(_investor, _amountWei, numTokens);
    }

    /**
     * @dev updates the state and transfers the tokens
     * @param _investor the address of the investor
     * @param _amountWei the investment amount in wei
     * @param _numTokens the number of tokens
     * */
    function _processPurchase(
        address _investor,
        uint256 _amountWei,
        uint256 _numTokens
    ) internal {
        availableTokens = availableTokens.sub(_numTokens);
        weiRaised = weiRaised.add(_amountWei);
        InvestorTotalDeposits[_investor] = InvestorTotalDeposits[_investor].add(
            _amountWei
        );
        CSOVToken tokenInstance = CSOVToken(token);
        tokenInstance.transfer(_investor, _numTokens);
        emit TokenPurchase(_investor, _amountWei, _numTokens);
    }

    /**
     * @dev   Add to whiteList and resolve max deposit of _investor
     * @param _investor address
     */
    function getMaxPurchase(address _investor) public view returns (uint256) {
        uint256 maxpurchase = 0;
        for (uint256 i = 0; i < NFTAddresses.length; i++) {
            if (IERC721(NFTAddresses[i]).balanceOf(_investor) > 0) {
                maxpurchase = MaxDepositPerNFT[NFTAddresses[i]];
                break;
            }
        }
        return (maxpurchase);
    }

    /**
     * @dev  calculate token amount
     * @param _weiAmount - The wei deposit value
     */
    function getTokenAmount(uint256 _weiAmount)
        internal
        view
        returns (uint256)
    {
        return _weiAmount.mul(rate);
    }

    function saleClosure(bool _isSaleEnded) external onlyOwner() saleDone() {
        CSOVToken tokenInstance = CSOVToken(token);
        tokenInstance.saleClosure(_isSaleEnded);
        saleEnded = _isSaleEnded;
    }

    /**
     * @dev   Withdraw all Non sold tokens
     *
     */
    function withdrawTokens() external onlyOwner() saleDone() {
        uint256 tokensSovryn =
            tokenTotalSupply.sub(crowdSaleSupply).add(availableTokens);
        CSOVToken tokenInstance = CSOVToken(token);
        //tokenInstance.transfer(sovrynAddress, tokensSovryn);
        require(
            tokenInstance.transfer(sovrynAddress, tokensSovryn),
            "transfer failed"
        );
    }

    /**
     * @dev   Withdraw /all Funds - Function removed, handeled in Buy function on TX
     *
     */
    //function withdrawFunds() external onlyOwner saleDone {
    //    sovrynAddress.transfer(address(this).balance);
    //    // sovrynAddress.transfer(weiRaised);}
    //}

    function balanceOf(address _owner) external view returns (uint256) {
        CSOVToken tokenInstance = CSOVToken(token);
        return tokenInstance.balanceOf(_owner);
    }

    function stopSale(bool _isStopSale) external onlyAdmin {
        isStopSale = _isStopSale;
    }

    function renounceOwnership() public override onlyOwner {
        revert("Disable function");
    }

    function addAdmins(address[] calldata admins) external onlyOwner {
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == address(0)) {
                continue;
            }
            isAdmin[admins[i]] = true;
        }
    }

    function removeAdmins(address[] calldata admins) external onlyOwner {
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == address(0)) {
                continue;
            }
            isAdmin[admins[i]] = false;
        }
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "unauthorized");
        _;
    }

    modifier saleActive() {
        require(
            !isStopSale &&
                (end > 0 && block.timestamp < end && availableTokens > 0),
            "Sale must be active"
        );
        _;
    }
    modifier saleNotActive() {
        require(end == 0, "Sale should not be active");
        _;
    }

    modifier saleDone() {
        require(
            isStopSale ||
                (end > 0 && (block.timestamp >= end || availableTokens == 0)),
            "Sale has NOT ended"
        );
        _;
    }
}
`;
