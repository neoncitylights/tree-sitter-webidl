CallbackOrInterfaceOrMixin ::
    callback CallbackRestOrInterface
    interface InterfaceOrMixin

InterfaceOrMixin ::
    InterfaceRest
    MixinRest

InterfaceRest ::
    identifier Inheritance { InterfaceMembers } ;

Partial ::
    partial PartialDefinition

PartialDefinition ::
    interface PartialInterfaceOrPartialMixin
    PartialDictionary
    Namespace

PartialInterfaceOrPartialMixin ::
    PartialInterfaceRest
    MixinRest

PartialInterfaceRest ::
    identifier { PartialInterfaceMembers } ;

InterfaceMembers ::
    ExtendedAttributeList InterfaceMember InterfaceMembers
    ε

InterfaceMember ::
    PartialInterfaceMember
    Constructor

PartialInterfaceMembers ::
    ExtendedAttributeList PartialInterfaceMember PartialInterfaceMembers
    ε

PartialInterfaceMember ::
    Const
    Operation
    Stringifier
    StaticMember
    Iterable
    AsyncIterable
    ReadOnlyMember
    ReadWriteAttribute
    ReadWriteMaplike
    ReadWriteSetlike
    InheritAttribute

Inheritance ::
    : identifier
    ε

MixinRest ::
    mixin identifier { MixinMembers } ;

MixinMembers ::
    ExtendedAttributeList MixinMember MixinMembers
    ε

MixinMember ::
    Const
    RegularOperation
    Stringifier
    OptionalReadOnly AttributeRest

IncludesStatement ::
    identifier includes identifier ;

CallbackRestOrInterface ::
    CallbackRest
    interface identifier { CallbackInterfaceMembers } ;

CallbackInterfaceMembers ::
    ExtendedAttributeList CallbackInterfaceMember CallbackInterfaceMembers
    ε

CallbackInterfaceMember ::
    Const
    RegularOperation

CallbackRest ::
    identifier = Type ( ArgumentList ) ;
